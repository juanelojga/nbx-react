import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  buildSchema,
  type DocumentNode,
  type FragmentDefinitionNode,
  getNamedType,
  type GraphQLCompositeType,
  type GraphQLSchema,
  isCompositeType,
  isObjectType,
  Kind,
  type SelectionSetNode,
} from "graphql";

let cachedSchema: GraphQLSchema | null = null;

/** The committed backend schema, parsed once per process. */
export function getTestSchema(): GraphQLSchema {
  cachedSchema ??= buildSchema(
    readFileSync(resolve(process.cwd(), "schema.graphql"), "utf8")
  );
  return cachedSchema;
}

type JsonObject = Record<string, unknown>;

/**
 * Add `__typename` to a mock response by walking the operation's selection
 * set against the schema. Apollo needs typenames to match fragment spreads
 * when normalizing results; real servers always return them, hand-written
 * mocks usually don't. Mutates and returns `data`.
 */
export function addTypenames<T>(document: DocumentNode, data: T): T {
  const schema = getTestSchema();
  const fragments = new Map<string, FragmentDefinitionNode>();
  for (const definition of document.definitions) {
    if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      fragments.set(definition.name.value, definition);
    }
  }
  const operation = document.definitions.find(
    (definition) => definition.kind === Kind.OPERATION_DEFINITION
  );
  if (!operation || operation.kind !== Kind.OPERATION_DEFINITION) return data;

  const rootType =
    operation.operation === "mutation"
      ? schema.getMutationType()
      : schema.getQueryType();
  if (!rootType) return data;

  const walk = (
    selectionSet: SelectionSetNode,
    parentType: GraphQLCompositeType,
    value: unknown
  ): void => {
    if (value == null) return;
    if (Array.isArray(value)) {
      for (const item of value) walk(selectionSet, parentType, item);
      return;
    }
    if (typeof value !== "object") return;
    const record = value as JsonObject;
    if (isObjectType(parentType) && !("__typename" in record)) {
      record.__typename = parentType.name;
    }
    for (const selection of selectionSet.selections) {
      if (selection.kind === Kind.FIELD) {
        if (!selection.selectionSet || !isObjectType(parentType)) continue;
        const field = parentType.getFields()[selection.name.value];
        if (!field) continue;
        const namedType = getNamedType(field.type);
        if (!isCompositeType(namedType)) continue;
        const key = selection.alias?.value ?? selection.name.value;
        walk(selection.selectionSet, namedType, record[key]);
      } else if (selection.kind === Kind.FRAGMENT_SPREAD) {
        const fragment = fragments.get(selection.name.value);
        const type = fragment
          ? schema.getType(fragment.typeCondition.name.value)
          : undefined;
        if (fragment && type && isCompositeType(type)) {
          walk(fragment.selectionSet, type, record);
        }
      } else {
        const type = selection.typeCondition
          ? schema.getType(selection.typeCondition.name.value)
          : parentType;
        if (type && isCompositeType(type)) {
          walk(selection.selectionSet, type, record);
        }
      }
    }
  };

  walk(operation.selectionSet, rootType, data);
  return data;
}
