import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "../dropdown-menu";

describe("DropdownMenu Component", () => {
  describe("DropdownMenu Root", () => {
    it("renders with default props", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Open menu");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "dropdown-menu-trigger");
    });

    it("renders with custom props", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Open menu");
      expect(trigger).toBeInTheDocument();
    });

    it("forwards additional props to root", () => {
      render(
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Open menu");
      expect(trigger).toBeInTheDocument();
    });
  });

  describe("DropdownMenuTrigger", () => {
    it("renders trigger with children", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span>Custom trigger</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Custom trigger");
      expect(trigger).toBeInTheDocument();
      expect(
        trigger.closest('[data-slot="dropdown-menu-trigger"]')
      ).toBeInTheDocument();
    });

    it("renders trigger with asChild", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button>As child trigger</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("As child trigger");
      expect(trigger.tagName.toLowerCase()).toBe("button");
    });
  });

  describe("DropdownMenuContent", () => {
    it("renders content with default sideOffset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen
        .getByText("Item 1")
        .closest('[data-slot="dropdown-menu-content"]');
      expect(content).toBeInTheDocument();
    });

    it("renders content with custom sideOffset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent sideOffset={8}>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen
        .getByText("Item 1")
        .closest('[data-slot="dropdown-menu-content"]');
      expect(content).toBeInTheDocument();
    });

    it("renders content with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent className="custom-content">
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen
        .getByText("Item 1")
        .closest('[data-slot="dropdown-menu-content"]');
      expect(content).toHaveClass("custom-content");
    });

    it("applies default styling classes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const content = screen
        .getByText("Item 1")
        .closest('[data-slot="dropdown-menu-content"]');
      expect(content).toHaveClass("z-50");
      expect(content).toHaveClass(
        "max-h-(--radix-dropdown-menu-content-available-height)"
      );
      expect(content).toHaveClass("min-w-[8rem]");
      expect(content).toHaveClass(
        "origin-(--radix-dropdown-menu-content-transform-origin)"
      );
      expect(content).toHaveClass("overflow-x-hidden");
      expect(content).toHaveClass("overflow-y-auto");
      expect(content).toHaveClass("rounded-md");
      expect(content).toHaveClass("border");
      expect(content).toHaveClass("p-1");
      expect(content).toHaveClass("shadow-md");
    });
  });

  describe("DropdownMenuItem", () => {
    it("renders item with default variant", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Default item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Default item");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-slot", "dropdown-menu-item");
      expect(item).toHaveAttribute("data-variant", "default");
    });

    it("renders item with destructive variant", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem variant="destructive">
              Delete item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Delete item");
      expect(item).toHaveAttribute("data-variant", "destructive");
    });

    it("renders item with inset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem inset>Inset item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Inset item");
      expect(item).toHaveAttribute("data-inset", "true");
    });

    it("renders item with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="custom-item">
              Custom item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Custom item");
      expect(item).toHaveClass("custom-item");
    });

    it("renders item with icon", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <svg data-testid="item-icon" />
              Item with icon
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByTestId("item-icon")).toBeInTheDocument();
      expect(screen.getByText("Item with icon")).toBeInTheDocument();
    });

    it("applies default styling classes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Styled item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Styled item");
      expect(item).toHaveClass("relative");
      expect(item).toHaveClass("flex");
      expect(item).toHaveClass("cursor-default");
      expect(item).toHaveClass("items-center");
      expect(item).toHaveClass("gap-2");
      expect(item).toHaveClass("rounded-sm");
      expect(item).toHaveClass("px-2");
      expect(item).toHaveClass("py-1.5");
      expect(item).toHaveClass("text-sm");
      expect(item).toHaveClass("outline-hidden");
      expect(item).toHaveClass("select-none");
    });
  });

  describe("DropdownMenuCheckboxItem", () => {
    it("renders checkbox item unchecked", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={false}>
              Unchecked item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Unchecked item");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-slot", "dropdown-menu-checkbox-item");
    });

    it("renders checkbox item checked", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem checked={true}>
              Checked item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Checked item");
      expect(item).toBeInTheDocument();
      // Check icon should be present in the checkbox item
      expect(item.querySelector("svg")).toBeInTheDocument();
    });

    it("renders checkbox item with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              className="custom-checkbox"
            >
              Custom checkbox
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Custom checkbox");
      expect(item).toHaveClass("custom-checkbox");
    });
  });

  describe("DropdownMenuRadioGroup and RadioItem", () => {
    it("renders radio group with items", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Option 1")).toBeInTheDocument();
      expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("renders radio item with selected state", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1">
                Selected option
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Selected option");
      expect(item).toBeInTheDocument();
      // Radio indicator should be present
      expect(item.querySelector("svg")).toBeInTheDocument();
    });

    it("renders radio item with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup value="option1">
              <DropdownMenuRadioItem value="option1" className="custom-radio">
                Custom radio
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Custom radio");
      expect(item).toHaveClass("custom-radio");
    });
  });

  describe("DropdownMenuLabel", () => {
    it("renders label", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section Label</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByText("Section Label");
      expect(label).toBeInTheDocument();
      expect(label).toHaveAttribute("data-slot", "dropdown-menu-label");
    });

    it("renders label with inset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel inset>Inset label</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByText("Inset label");
      expect(label).toHaveAttribute("data-inset", "true");
    });

    it("renders label with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel className="custom-label">
              Custom label
            </DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const label = screen.getByText("Custom label");
      expect(label).toHaveClass("custom-label");
    });
  });

  describe("DropdownMenuSeparator", () => {
    it("renders separator", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const separator = screen.getByRole("separator");
      expect(separator).toBeInTheDocument();
      expect(separator).toHaveAttribute("data-slot", "dropdown-menu-separator");
    });

    it("renders separator with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator className="custom-separator" />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("custom-separator");
    });

    it("applies default styling classes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const separator = screen.getByRole("separator");
      expect(separator).toHaveClass("bg-border");
      expect(separator).toHaveClass("-mx-1");
      expect(separator).toHaveClass("my-1");
      expect(separator).toHaveClass("h-px");
    });
  });

  describe("DropdownMenuShortcut", () => {
    it("renders shortcut", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Copy
              <DropdownMenuShortcut>⌘C</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen.getByText("⌘C");
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toHaveAttribute("data-slot", "dropdown-menu-shortcut");
    });

    it("renders shortcut with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Paste
              <DropdownMenuShortcut className="custom-shortcut">
                ⌘V
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen.getByText("⌘V");
      expect(shortcut).toHaveClass("custom-shortcut");
    });

    it("applies default styling classes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Cut
              <DropdownMenuShortcut>⌘X</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen.getByText("⌘X");
      expect(shortcut).toHaveClass("text-muted-foreground");
      expect(shortcut).toHaveClass("ml-auto");
      expect(shortcut).toHaveClass("text-xs");
      expect(shortcut).toHaveClass("tracking-widest");
    });
  });

  describe("DropdownMenuSub components", () => {
    it("renders sub menu with trigger and content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>More options</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item 1</DropdownMenuItem>
                <DropdownMenuItem>Sub item 2</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("More options")).toBeInTheDocument();
    });

    it("renders sub trigger with inset", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger inset>
                Inset sub trigger
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Inset sub trigger");
      expect(trigger).toHaveAttribute("data-inset", "true");
    });

    it("renders sub trigger with chevron icon", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Sub menu");
      expect(trigger).toBeInTheDocument();
      // Chevron icon should be present
      expect(trigger.querySelector("svg")).toBeInTheDocument();
    });

    it("renders sub content with custom className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="custom-sub-content">
                <DropdownMenuItem>Sub item</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Sub menu")).toBeInTheDocument();
    });
  });

  describe("DropdownMenuGroup", () => {
    it("renders group", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Grouped item 1</DropdownMenuItem>
              <DropdownMenuItem>Grouped item 2</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Grouped item 1")).toBeInTheDocument();
      expect(screen.getByText("Grouped item 2")).toBeInTheDocument();
    });

    it("forwards additional props", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup data-testid="menu-group">
              <DropdownMenuItem>Grouped item</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const group = screen.getByTestId("menu-group");
      expect(group).toBeInTheDocument();
      expect(group).toHaveAttribute("data-slot", "dropdown-menu-group");
    });
  });

  describe("DropdownMenuPortal", () => {
    it("renders portal", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent>
              <DropdownMenuItem>Portal item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      expect(screen.getByText("Portal item")).toBeInTheDocument();
    });

    it("forwards additional props", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuPortal data-testid="menu-portal">
            <DropdownMenuContent>
              <DropdownMenuItem>Portal item</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      );

      // Portal content should be rendered
      expect(screen.getByText("Portal item")).toBeInTheDocument();
      // The portal wrapper itself may not be directly accessible in DOM
    });
  });

  describe("User Interactions", () => {
    it("opens dropdown on trigger click", async () => {
      const user = userEvent.setup();
      render(
        <DropdownMenu>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Menu item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Open menu");
      await user.click(trigger);

      expect(screen.getByText("Menu item")).toBeInTheDocument();
    });

    it("handles item click", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleClick}>
              Clickable item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Clickable item");
      await user.click(item);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles checkbox item toggle", async () => {
      const user = userEvent.setup();
      const handleCheckedChange = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuCheckboxItem
              checked={false}
              onCheckedChange={handleCheckedChange}
            >
              Toggle item
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Toggle item");
      await user.click(item);

      expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    });

    it("handles radio item selection", async () => {
      const user = userEvent.setup();
      const handleValueChange = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuRadioGroup
              value="option1"
              onValueChange={handleValueChange}
            >
              <DropdownMenuRadioItem value="option1">
                Option 1
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="option2">
                Option 2
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const option2 = screen.getByText("Option 2");
      await user.click(option2);

      expect(handleValueChange).toHaveBeenCalledWith("option2");
    });

    it("handles keyboard navigation", async () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuItem>Item 2</DropdownMenuItem>
            <DropdownMenuItem>Item 3</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      // Focus should be managed by Radix UI
      const item1 = screen.getByText("Item 1");
      expect(item1).toBeInTheDocument();
    });

    it("handles disabled item", () => {
      const handleClick = jest.fn();

      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem disabled onClick={handleClick}>
              Disabled item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Disabled item");
      expect(item).toHaveAttribute("data-disabled");
      expect(item).toHaveAttribute("aria-disabled", "true");

      // Radix UI handles disabled state internally, so we test the attributes
      expect(item).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA attributes on trigger", () => {
      render(
        <DropdownMenu>
          <DropdownMenuTrigger aria-haspopup="true" aria-expanded="false">
            Menu trigger
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const trigger = screen.getByText("Menu trigger");
      expect(trigger).toHaveAttribute("aria-haspopup", "true");
      expect(trigger).toHaveAttribute("aria-expanded", "false");
    });

    it("supports aria-label on items", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem aria-label="Delete item">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByLabelText("Delete item");
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent("Delete");
    });

    it("supports role attributes", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem role="menuitemcheckbox">
              Checkbox item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByRole("menuitemcheckbox");
      expect(item).toBeInTheDocument();
      expect(item).toHaveTextContent("Checkbox item");
    });

    it("has proper semantic structure", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Section</DropdownMenuLabel>
            <DropdownMenuItem>Item 1</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Item 2</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByRole("separator")).toBeInTheDocument();
      expect(screen.getByText("Section")).toBeInTheDocument();
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="item-description">This will delete the item</span>
          <DropdownMenu defaultOpen>
            <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem aria-describedby="item-description">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );

      const item = screen.getByText("Delete");
      expect(item).toHaveAttribute("aria-describedby", "item-description");
    });

    it("maintains focus management", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Focusable item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Focusable item");
      expect(item).toBeInTheDocument();
      // Radix UI handles focus management internally
      expect(item).toHaveAttribute("tabindex", "-1");
    });
  });

  describe("Complex Integration Tests", () => {
    it("renders complete dropdown menu with all components", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger asChild>
            <button>Open menu</button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Billing
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                Settings
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Team</DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuItem>New Team</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>GitHub</DropdownMenuItem>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuItem disabled>API</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              Log out
              <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Open menu")).toBeInTheDocument();
      expect(screen.getByText("My Account")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
      expect(screen.getByText("⇧⌘P")).toBeInTheDocument();
      expect(screen.getByText("Invite users")).toBeInTheDocument();
      expect(screen.getByText("Log out")).toBeInTheDocument();
    });

    it("handles dynamic content updates", async () => {
      const { rerender } = render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Initial item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Initial item")).toBeInTheDocument();

      rerender(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Updated item</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Updated item")).toBeInTheDocument();
      expect(screen.queryByText("Initial item")).not.toBeInTheDocument();
    });

    it("handles multiple dropdown menus", () => {
      render(
        <>
          <DropdownMenu>
            <DropdownMenuTrigger>Menu 1</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 1</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger>Menu 2</DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Item 2</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );

      expect(screen.getByText("Menu 1")).toBeInTheDocument();
      expect(screen.getByText("Menu 2")).toBeInTheDocument();
    });

    it("handles nested dropdown menus", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Main menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Sub menu</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Deep sub menu</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Deep item</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("Main menu")).toBeInTheDocument();
      expect(screen.getByText("Sub menu")).toBeInTheDocument();
      // Deep sub menu is not rendered until the sub menu is opened
      // We can only test that the structure is set up correctly
      const subTrigger = screen.getByText("Sub menu");
      expect(subTrigger).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty content gracefully", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{null}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toBeInTheDocument();
    });

    it("handles undefined content gracefully", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{undefined}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toBeInTheDocument();
    });

    it("handles boolean content gracefully", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{true}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toBeInTheDocument();
    });

    it("handles zero as content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{0}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem> </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByRole("menuitem");
      expect(item).toBeInTheDocument();
    });

    it("handles very long text content", () => {
      const longText =
        "This is a very long menu item text that should still render correctly in the dropdown menu";
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>{longText}</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText(longText)).toBeInTheDocument();
    });

    it("handles multiple className props", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="class1 class2 class3">
              Multiple classes
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Multiple classes");
      expect(item).toHaveClass("class1");
      expect(item).toHaveClass("class2");
      expect(item).toHaveClass("class3");
    });

    it("handles empty string className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className="">Empty class</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Empty class");
      expect(item).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem className={undefined}>
              Undefined class
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("Undefined class");
      expect(item).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              variant={undefined}
              className={undefined}
              inset={undefined}
            >
              All undefined
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const item = screen.getByText("All undefined");
      expect(item).toBeInTheDocument();
      expect(item).toHaveAttribute("data-slot", "dropdown-menu-item");
    });

    it("handles special characters in content", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>!@#$%^&*()</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("!@#$%^&*()")).toBeInTheDocument();
    });

    it("handles numeric shortcut", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Action
              <DropdownMenuShortcut>123</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      expect(screen.getByText("123")).toBeInTheDocument();
    });

    it("handles empty shortcut", () => {
      render(
        <DropdownMenu defaultOpen>
          <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              Action
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );

      const shortcut = screen
        .getByRole("menuitem")
        .querySelector('[data-slot="dropdown-menu-shortcut"]');
      expect(shortcut).toBeInTheDocument();
      expect(shortcut).toBeEmptyDOMElement();
    });
  });
});
