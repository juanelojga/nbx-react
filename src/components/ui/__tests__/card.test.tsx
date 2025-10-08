import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from "../card";

describe("Card Component", () => {
  describe("Card Rendering", () => {
    it("renders with default props", () => {
      render(<Card>Card content</Card>);

      const card = screen.getByText("Card content");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("data-slot", "card");
      expect(card.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(<Card className="custom-card">Custom card</Card>);

      const card = screen.getByText("Custom card");
      expect(card).toHaveClass("custom-card");
    });

    it("forwards additional props", () => {
      render(
        <Card id="test-id" data-testid="test-card">
          Card with props
        </Card>
      );

      const card = screen.getByText("Card with props");
      expect(card).toHaveAttribute("id", "test-id");
      expect(card).toHaveAttribute("data-testid", "test-card");
    });

    it("renders with empty content", () => {
      render(<Card data-testid="empty-card" />);

      const card = screen.getByTestId("empty-card");
      expect(card).toBeInTheDocument();
      expect(card).toBeEmptyDOMElement();
    });

    it("renders with complex nested content", () => {
      render(
        <Card>
          <div>
            <h3>Nested heading</h3>
            <p>Nested paragraph</p>
          </div>
        </Card>
      );

      expect(screen.getByText("Nested heading")).toBeInTheDocument();
      expect(screen.getByText("Nested paragraph")).toBeInTheDocument();
    });

    it("renders with SVG elements", () => {
      render(
        <Card>
          <svg data-testid="card-icon" />
          Card with icon
        </Card>
      );

      expect(screen.getByTestId("card-icon")).toBeInTheDocument();
      expect(screen.getByText("Card with icon")).toBeInTheDocument();
    });
  });

  describe("CardHeader Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardHeader>Header content</CardHeader>
        </Card>
      );

      const header = screen.getByText("Header content");
      expect(header).toBeInTheDocument();
      expect(header).toHaveAttribute("data-slot", "card-header");
      expect(header.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardHeader className="custom-header">Custom header</CardHeader>
        </Card>
      );

      const header = screen.getByText("Custom header");
      expect(header).toHaveClass("custom-header");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardHeader id="header-id" data-testid="test-header">
            Header with props
          </CardHeader>
        </Card>
      );

      const header = screen.getByText("Header with props");
      expect(header).toHaveAttribute("id", "header-id");
      expect(header).toHaveAttribute("data-testid", "test-header");
    });

    it("renders with CardTitle and CardDescription", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Card Title")).toBeInTheDocument();
      expect(screen.getByText("Card Description")).toBeInTheDocument();
    });

    it("renders with CardAction", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Title with Action</CardTitle>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Title with Action")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
    });
  });

  describe("CardTitle Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("Card Title");
      expect(title).toBeInTheDocument();
      expect(title).toHaveAttribute("data-slot", "card-title");
      expect(title.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle className="custom-title">Custom title</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("Custom title");
      expect(title).toHaveClass("custom-title");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle id="title-id" data-testid="test-title">
              Title with props
            </CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("Title with props");
      expect(title).toHaveAttribute("id", "title-id");
      expect(title).toHaveAttribute("data-testid", "test-title");
    });

    it("renders with numeric content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>42</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("42");
      expect(title).toBeInTheDocument();
    });

    it("renders with special characters", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>!@#$%^&*()</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("!@#$%^&*()");
      expect(title).toBeInTheDocument();
    });
  });

  describe("CardDescription Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
        </Card>
      );

      const description = screen.getByText("Card Description");
      expect(description).toBeInTheDocument();
      expect(description).toHaveAttribute("data-slot", "card-description");
      expect(description.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription className="custom-description">
              Custom description
            </CardDescription>
          </CardHeader>
        </Card>
      );

      const description = screen.getByText("Custom description");
      expect(description).toHaveClass("custom-description");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription id="description-id" data-testid="test-description">
              Description with props
            </CardDescription>
          </CardHeader>
        </Card>
      );

      const description = screen.getByText("Description with props");
      expect(description).toHaveAttribute("id", "description-id");
      expect(description).toHaveAttribute("data-testid", "test-description");
    });

    it("renders with long text content", () => {
      const longText =
        "This is a very long description that should still render correctly within the card component";
      render(
        <Card>
          <CardHeader>
            <CardDescription>{longText}</CardDescription>
          </CardHeader>
        </Card>
      );

      const description = screen.getByText(longText);
      expect(description).toBeInTheDocument();
    });
  });

  describe("CardAction Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction>
              <button>Action Button</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const action = screen.getByText("Action Button");
      expect(action).toBeInTheDocument();
      expect(action.parentElement).toHaveAttribute("data-slot", "card-action");
      expect(action.parentElement?.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction className="custom-action">
              <button>Custom action</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const actionContainer = screen.getByText("Custom action").parentElement;
      expect(actionContainer).toHaveClass("custom-action");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction id="action-id" data-testid="test-action">
              <button>Action with props</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const action = screen.getByText("Action with props").parentElement;
      expect(action).toHaveAttribute("id", "action-id");
      expect(action).toHaveAttribute("data-testid", "test-action");
    });

    it("renders with multiple action elements", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction>
              <button>Action 1</button>
              <button>Action 2</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      expect(screen.getByText("Action 1")).toBeInTheDocument();
      expect(screen.getByText("Action 2")).toBeInTheDocument();
    });
  });

  describe("CardContent Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardContent>Content area</CardContent>
        </Card>
      );

      const content = screen.getByText("Content area");
      expect(content).toBeInTheDocument();
      expect(content).toHaveAttribute("data-slot", "card-content");
      expect(content.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardContent className="custom-content">Custom content</CardContent>
        </Card>
      );

      const content = screen.getByText("Custom content");
      expect(content).toHaveClass("custom-content");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardContent id="content-id" data-testid="test-content">
            Content with props
          </CardContent>
        </Card>
      );

      const content = screen.getByText("Content with props");
      expect(content).toHaveAttribute("id", "content-id");
      expect(content).toHaveAttribute("data-testid", "test-content");
    });

    it("renders with complex content", () => {
      render(
        <Card>
          <CardContent>
            <p>Paragraph content</p>
            <ul>
              <li>List item 1</li>
              <li>List item 2</li>
            </ul>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Paragraph content")).toBeInTheDocument();
      expect(screen.getByText("List item 1")).toBeInTheDocument();
      expect(screen.getByText("List item 2")).toBeInTheDocument();
    });
  });

  describe("CardFooter Rendering", () => {
    it("renders with default props", () => {
      render(
        <Card>
          <CardFooter>Footer content</CardFooter>
        </Card>
      );

      const footer = screen.getByText("Footer content");
      expect(footer).toBeInTheDocument();
      expect(footer).toHaveAttribute("data-slot", "card-footer");
      expect(footer.tagName.toLowerCase()).toBe("div");
    });

    it("renders with custom className", () => {
      render(
        <Card>
          <CardFooter className="custom-footer">Custom footer</CardFooter>
        </Card>
      );

      const footer = screen.getByText("Custom footer");
      expect(footer).toHaveClass("custom-footer");
    });

    it("forwards additional props", () => {
      render(
        <Card>
          <CardFooter id="footer-id" data-testid="test-footer">
            Footer with props
          </CardFooter>
        </Card>
      );

      const footer = screen.getByText("Footer with props");
      expect(footer).toHaveAttribute("id", "footer-id");
      expect(footer).toHaveAttribute("data-testid", "test-footer");
    });

    it("renders with button elements", () => {
      render(
        <Card>
          <CardFooter>
            <button>Cancel</button>
            <button>Save</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Save")).toBeInTheDocument();
    });
  });

  describe("Complete Card Structure", () => {
    it("renders complete card with all components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Complete Card Title</CardTitle>
            <CardDescription>Complete card description</CardDescription>
            <CardAction>
              <button>More options</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>This is the main content of the card.</p>
            <p>It can contain multiple paragraphs.</p>
          </CardContent>
          <CardFooter>
            <button>Cancel</button>
            <button>Primary Action</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Complete Card Title")).toBeInTheDocument();
      expect(screen.getByText("Complete card description")).toBeInTheDocument();
      expect(screen.getByText("More options")).toBeInTheDocument();
      expect(
        screen.getByText("This is the main content of the card.")
      ).toBeInTheDocument();
      expect(
        screen.getByText("It can contain multiple paragraphs.")
      ).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
      expect(screen.getByText("Primary Action")).toBeInTheDocument();
    });

    it("renders card with only header and content", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Simple Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Simple card content</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Simple Card")).toBeInTheDocument();
      expect(screen.getByText("Simple card content")).toBeInTheDocument();
    });

    it("renders card with only content and footer", () => {
      render(
        <Card>
          <CardContent>
            <p>Content without header</p>
          </CardContent>
          <CardFooter>
            <button>Footer button</button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Content without header")).toBeInTheDocument();
      expect(screen.getByText("Footer button")).toBeInTheDocument();
    });
  });

  describe("User Interactions", () => {
    it("handles click events on buttons within card", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Card>
          <CardContent>
            <button onClick={handleClick}>Clickable button</button>
          </CardContent>
        </Card>
      );

      const button = screen.getByText("Clickable button");
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles click events on action buttons", async () => {
      const user = userEvent.setup();
      const handleActionClick = jest.fn();

      render(
        <Card>
          <CardHeader>
            <CardTitle>Card with Action</CardTitle>
            <CardAction>
              <button onClick={handleActionClick}>Action</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const actionButton = screen.getByText("Action");
      await user.click(actionButton);

      expect(handleActionClick).toHaveBeenCalledTimes(1);
    });

    it("handles keyboard navigation", async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <Card>
          <CardFooter>
            <button onClick={handleClick}>Keyboard button</button>
          </CardFooter>
        </Card>
      );

      const button = screen.getByText("Keyboard button");
      button.focus();
      await user.keyboard("{Enter}");

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("handles hover states on interactive elements", async () => {
      const user = userEvent.setup();

      render(
        <Card>
          <CardContent>
            <button>Hover button</button>
          </CardContent>
        </Card>
      );

      const button = screen.getByText("Hover button");
      await user.hover(button);

      expect(button).toBeInTheDocument();
    });

    it("handles focus states on interactive elements", () => {
      render(
        <Card>
          <CardFooter>
            <button>Focusable button</button>
          </CardFooter>
        </Card>
      );

      const button = screen.getByText("Focusable button");
      button.focus();

      expect(document.activeElement).toBe(button);
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic HTML structure", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Accessible Card</CardTitle>
            <CardDescription>Accessible description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Accessible content</p>
          </CardContent>
          <CardFooter>
            <button>Accessible button</button>
          </CardFooter>
        </Card>
      );

      const card =
        screen.getByText("Accessible Card").parentElement?.parentElement;
      expect(card).toHaveAttribute("data-slot", "card");

      const title = screen.getByText("Accessible Card");
      expect(title).toHaveAttribute("data-slot", "card-title");

      const description = screen.getByText("Accessible description");
      expect(description).toHaveAttribute("data-slot", "card-description");

      const button = screen.getByText("Accessible button");
      expect(button.tagName.toLowerCase()).toBe("button");
    });

    it("supports ARIA attributes on card elements", () => {
      render(
        <Card role="article" aria-label="Important card">
          <CardHeader>
            <CardTitle>ARIA Card</CardTitle>
          </CardHeader>
        </Card>
      );

      const card = screen.getByLabelText("Important card");
      expect(card).toBeInTheDocument();
      expect(card).toHaveAttribute("role", "article");
    });

    it("supports aria-label for screen readers on buttons", () => {
      render(
        <Card>
          <CardAction>
            <button aria-label="Close card">X</button>
          </CardAction>
        </Card>
      );

      const button = screen.getByLabelText("Close card");
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent("X");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="card-description">Additional card information</span>
          <Card aria-describedby="card-description" data-testid="test-card">
            <CardContent>Card with description</CardContent>
          </Card>
        </>
      );

      const card = screen.getByTestId("test-card");
      expect(card).toHaveAttribute("aria-describedby", "card-description");
    });

    it("supports aria-live for dynamic content", () => {
      render(
        <Card>
          <CardContent aria-live="polite">
            <p>Dynamic content area</p>
          </CardContent>
        </Card>
      );

      const content = screen.getByText("Dynamic content area").parentElement;
      expect(content).toHaveAttribute("aria-live", "polite");
    });

    it("maintains proper heading hierarchy when used with headings", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <h3>Proper Heading</h3>
            </CardTitle>
          </CardHeader>
        </Card>
      );

      const heading = screen.getByText("Proper Heading");
      expect(heading.tagName.toLowerCase()).toBe("h3");
    });
  });

  describe("CSS Classes and Styling", () => {
    it("applies default card classes", () => {
      render(<Card data-testid="styled-card">Styled card</Card>);

      const card = screen.getByTestId("styled-card");
      expect(card).toHaveClass("bg-card");
      expect(card).toHaveClass("text-card-foreground");
      expect(card).toHaveClass("flex");
      expect(card).toHaveClass("flex-col");
      expect(card).toHaveClass("gap-6");
      expect(card).toHaveClass("rounded-xl");
      expect(card).toHaveClass("border");
      expect(card).toHaveClass("border-border/50");
      expect(card).toHaveClass("py-6");
      expect(card).toHaveClass("shadow-md");
      expect(card).toHaveClass("hover:shadow-lg");
      expect(card).toHaveClass("transition-shadow");
      expect(card).toHaveClass("duration-200");
    });

    it("applies card header classes", () => {
      render(
        <Card>
          <CardHeader data-testid="styled-header">Header</CardHeader>
        </Card>
      );

      const header = screen.getByTestId("styled-header");
      expect(header).toHaveClass("@container/card-header");
      expect(header).toHaveClass("grid");
      expect(header).toHaveClass("auto-rows-min");
      expect(header).toHaveClass("grid-rows-[auto_auto]");
      expect(header).toHaveClass("items-start");
      expect(header).toHaveClass("gap-1.5");
      expect(header).toHaveClass("px-6");
      expect(header).toHaveClass(
        "has-data-[slot=card-action]:grid-cols-[1fr_auto]"
      );
      expect(header).toHaveClass("[.border-b]:pb-6");
    });

    it("applies card title classes", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle data-testid="styled-title">Title</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByTestId("styled-title");
      expect(title).toHaveClass("font-semibold");
      expect(title).toHaveClass("text-lg");
      expect(title).toHaveClass("tracking-tight");
    });

    it("applies card description classes", () => {
      render(
        <Card>
          <CardHeader>
            <CardDescription data-testid="styled-description">
              Description
            </CardDescription>
          </CardHeader>
        </Card>
      );

      const description = screen.getByTestId("styled-description");
      expect(description).toHaveClass("text-muted-foreground");
      expect(description).toHaveClass("text-sm");
      expect(description).toHaveClass("leading-relaxed");
    });

    it("applies card action classes", () => {
      render(
        <Card>
          <CardHeader>
            <CardAction data-testid="styled-action">
              <button>Action</button>
            </CardAction>
          </CardHeader>
        </Card>
      );

      const action = screen.getByTestId("styled-action");
      expect(action).toHaveClass("col-start-2");
      expect(action).toHaveClass("row-span-2");
      expect(action).toHaveClass("row-start-1");
      expect(action).toHaveClass("self-start");
      expect(action).toHaveClass("justify-self-end");
    });

    it("applies card content classes", () => {
      render(
        <Card>
          <CardContent data-testid="styled-content">Content</CardContent>
        </Card>
      );

      const content = screen.getByTestId("styled-content");
      expect(content).toHaveClass("px-6");
    });

    it("applies card footer classes", () => {
      render(
        <Card>
          <CardFooter data-testid="styled-footer">Footer</CardFooter>
        </Card>
      );

      const footer = screen.getByTestId("styled-footer");
      expect(footer).toHaveClass("flex");
      expect(footer).toHaveClass("items-center");
      expect(footer).toHaveClass("px-6");
      expect(footer).toHaveClass("[.border-t]:pt-6");
    });
  });

  describe("Integration Tests", () => {
    it("renders multiple cards with different content", () => {
      render(
        <>
          <Card>
            <CardHeader>
              <CardTitle>Card 1</CardTitle>
            </CardHeader>
            <CardContent>Content 1</CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Card 2</CardTitle>
            </CardHeader>
            <CardContent>Content 2</CardContent>
          </Card>
        </>
      );

      expect(screen.getByText("Card 1")).toBeInTheDocument();
      expect(screen.getByText("Content 1")).toBeInTheDocument();
      expect(screen.getByText("Card 2")).toBeInTheDocument();
      expect(screen.getByText("Content 2")).toBeInTheDocument();
    });

    it("handles dynamic content updates", async () => {
      const { rerender } = render(
        <Card>
          <CardContent>Initial content</CardContent>
        </Card>
      );

      expect(screen.getByText("Initial content")).toBeInTheDocument();

      rerender(
        <Card>
          <CardContent>Updated content</CardContent>
        </Card>
      );

      expect(screen.getByText("Updated content")).toBeInTheDocument();
      expect(screen.queryByText("Initial content")).not.toBeInTheDocument();
    });

    it("renders with complex nested components", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>
              <span>
                <strong>Complex</strong> <em>nested</em> title
              </span>
            </CardTitle>
            <CardAction>
              <button>
                <svg data-testid="action-icon" />
                Action
              </button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div>
              <h4>Subheading</h4>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <button>
              <svg data-testid="footer-icon" />
              Footer Action
            </button>
          </CardFooter>
        </Card>
      );

      expect(screen.getByText("Complex")).toBeInTheDocument();
      expect(screen.getByText("nested")).toBeInTheDocument();
      expect(screen.getByText("title")).toBeInTheDocument();
      expect(screen.getByTestId("action-icon")).toBeInTheDocument();
      expect(screen.getByText("Action")).toBeInTheDocument();
      expect(screen.getByText("Subheading")).toBeInTheDocument();
      expect(screen.getByText("Item 1")).toBeInTheDocument();
      expect(screen.getByText("Item 2")).toBeInTheDocument();
      expect(screen.getByTestId("footer-icon")).toBeInTheDocument();
      expect(screen.getByText("Footer Action")).toBeInTheDocument();
    });

    it("handles loading state pattern", () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Loading Card</CardTitle>
          </CardHeader>
          <CardContent>
            <div data-testid="loading-spinner" className="animate-spin" />
            <p>Loading content...</p>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Loading Card")).toBeInTheDocument();
      expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
      expect(screen.getByText("Loading content...")).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles null children gracefully", () => {
      render(
        <Card data-testid="test-card">
          <CardContent>{null}</CardContent>
        </Card>
      );

      const card = screen.getByTestId("test-card");
      expect(card).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(
        <Card data-testid="test-card">
          <CardContent>{undefined}</CardContent>
        </Card>
      );

      const card = screen.getByTestId("test-card");
      expect(card).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(
        <Card data-testid="test-card">
          <CardContent>{true}</CardContent>
        </Card>
      );

      const card = screen.getByTestId("test-card");
      expect(card).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(
        <Card>
          <CardContent>{0}</CardContent>
        </Card>
      );

      const content = screen.getByText("0");
      expect(content).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(
        <Card data-testid="test-card">
          <CardContent> </CardContent>
        </Card>
      );

      const card = screen.getByTestId("test-card");
      expect(card).toBeInTheDocument();
    });

    it("handles very long single word in title", () => {
      const longWord = "supercalifragilisticexpialidocious";
      render(
        <Card>
          <CardHeader>
            <CardTitle>{longWord}</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText(longWord);
      expect(title).toBeInTheDocument();
    });

    it("handles multiple className props", () => {
      render(<Card className="class1 class2 class3">Multiple classes</Card>);

      const card = screen.getByText("Multiple classes");
      expect(card).toHaveClass("class1");
      expect(card).toHaveClass("class2");
      expect(card).toHaveClass("class3");
    });

    it("handles empty string className", () => {
      render(<Card className="">Empty class</Card>);

      const card = screen.getByText("Empty class");
      expect(card).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(<Card className={undefined}>Undefined class</Card>);

      const card = screen.getByText("Undefined class");
      expect(card).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <Card className={undefined}>
          <CardHeader className={undefined}>
            <CardTitle className={undefined}>All undefined</CardTitle>
          </CardHeader>
        </Card>
      );

      const title = screen.getByText("All undefined");
      expect(title).toBeInTheDocument();
    });

    it("handles deeply nested card structure", () => {
      render(
        <Card>
          <CardContent>
            <Card>
              <CardHeader>
                <CardTitle>Nested Card</CardTitle>
              </CardHeader>
              <CardContent>Nested content</CardContent>
            </Card>
          </CardContent>
        </Card>
      );

      expect(screen.getByText("Nested Card")).toBeInTheDocument();
      expect(screen.getByText("Nested content")).toBeInTheDocument();
    });
  });
});
