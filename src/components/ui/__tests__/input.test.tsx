import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "../input";

describe("Input Component", () => {
  describe("Input Rendering", () => {
    it("renders with default props", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "input");
      expect(input.tagName.toLowerCase()).toBe("input");
    });

    it("renders with placeholder text", () => {
      render(<Input placeholder="Enter your name" />);

      const input = screen.getByPlaceholderText("Enter your name");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("data-slot", "input");
    });

    it("renders with custom className", () => {
      render(<Input className="custom-input" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("custom-input");
    });

    it("renders with default CSS classes", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("h-10");
      expect(input).toHaveClass("w-full");
      expect(input).toHaveClass("min-w-0");
      expect(input).toHaveClass("rounded-lg");
      expect(input).toHaveClass("border-2");
      expect(input).toHaveClass("bg-background");
      expect(input).toHaveClass("px-4");
      expect(input).toHaveClass("py-2");
      expect(input).toHaveClass("text-base");
      expect(input).toHaveClass("shadow-sm");
      expect(input).toHaveClass("transition-all");
      expect(input).toHaveClass("duration-200");
      expect(input).toHaveClass("outline-none");
    });

    it("renders with focus and hover classes", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("focus-visible:border-primary");
      expect(input).toHaveClass("focus-visible:ring-2");
      expect(input).toHaveClass("focus-visible:ring-ring");
      expect(input).toHaveClass("focus-visible:ring-offset-2");
      expect(input).toHaveClass("focus-visible:ring-offset-background");
      expect(input).toHaveClass("hover:border-primary/50");
    });

    it("renders with aria-invalid classes", () => {
      render(<Input aria-invalid="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("aria-invalid:ring-destructive/50");
      expect(input).toHaveClass("aria-invalid:border-destructive");
    });

    it("renders with disabled state", () => {
      render(<Input disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("disabled");
      expect(input).toHaveClass("disabled:pointer-events-none");
      expect(input).toHaveClass("disabled:cursor-not-allowed");
      expect(input).toHaveClass("disabled:opacity-50");
    });

    it("renders with value prop", () => {
      render(<Input value="test value" />);

      const input = screen.getByRole("textbox") as HTMLInputElement;
      expect(input.value).toBe("test value");
    });

    it("renders with name attribute", () => {
      render(<Input name="username" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("name", "username");
    });

    it("renders with id attribute", () => {
      render(<Input id="user-input" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("id", "user-input");
    });

    it("renders with required attribute", () => {
      render(<Input required />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("required");
    });

    it("renders with readonly attribute", () => {
      render(<Input readOnly />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("readonly");
    });

    it("renders with maxLength attribute", () => {
      render(<Input maxLength={50} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("maxLength", "50");
    });

    it("renders with minLength attribute", () => {
      render(<Input minLength={5} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("minLength", "5");
    });

    it("renders with pattern attribute", () => {
      render(<Input pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("pattern", "[0-9]{3}-[0-9]{3}-[0-9]{4}");
    });

    it("renders with autoComplete attribute", () => {
      render(<Input autoComplete="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("autoComplete", "email");
    });

    it("renders with multiple CSS classes", () => {
      render(<Input className="class1 class2 class3" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("class1");
      expect(input).toHaveClass("class2");
      expect(input).toHaveClass("class3");
    });

    it("renders with data attributes", () => {
      render(<Input data-testid="custom-input" data-field="username" />);

      const input = screen.getByTestId("custom-input");
      expect(input).toHaveAttribute("data-field", "username");
    });

    it("renders with aria-label", () => {
      render(<Input aria-label="Username input" />);

      const input = screen.getByLabelText("Username input");
      expect(input).toBeInTheDocument();
    });

    it("renders with aria-describedby", () => {
      render(
        <>
          <span id="input-help">Enter your username</span>
          <Input aria-describedby="input-help" />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "input-help");
    });

    it("renders with title attribute", () => {
      render(<Input title="Enter your email address" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("title", "Enter your email address");
    });

    it("renders with tabIndex", () => {
      render(<Input tabIndex={0} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("tabIndex", "0");
    });

    it("renders with form attribute", () => {
      render(<Input form="user-form" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("form", "user-form");
    });

    it("renders with step attribute for number inputs", () => {
      render(<Input type="number" step="0.1" />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("step", "0.1");
    });

    it("renders with min and max attributes", () => {
      render(<Input type="number" min="0" max="100" />);

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
    });
  });

  describe("User Interactions", () => {
    it("handles typing text", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "Hello World");

      expect(handleChange).toHaveBeenCalledTimes(11); // Once for each character
      expect(input).toHaveValue("Hello World");
    });

    it("handles focus events", async () => {
      const user = userEvent.setup();
      const handleFocus = jest.fn();

      render(<Input onFocus={handleFocus} />);

      const input = screen.getByRole("textbox");
      await user.click(input);

      expect(handleFocus).toHaveBeenCalledTimes(1);
      expect(document.activeElement).toBe(input);
    });

    it("handles blur events", async () => {
      const user = userEvent.setup();
      const handleBlur = jest.fn();

      render(<Input onBlur={handleBlur} />);

      const input = screen.getByRole("textbox");
      input.focus();
      await user.click(document.body);

      expect(handleBlur).toHaveBeenCalledTimes(1);
    });

    it("handles disabled input and prevents interactions", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input disabled onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "test");

      expect(handleChange).not.toHaveBeenCalled();
      expect(input).toHaveAttribute("disabled");
    });

    it("handles keyboard navigation with Tab", async () => {
      const user = userEvent.setup();

      render(
        <>
          <Input data-testid="input1" />
          <Input data-testid="input2" />
        </>
      );

      const input1 = screen.getByTestId("input1");
      const input2 = screen.getByTestId("input2");

      input1.focus();
      expect(document.activeElement).toBe(input1);

      await user.tab();

      expect(document.activeElement).toBe(input2);
    });

    it("handles paste events", async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();

      render(<Input onChange={handleChange} />);

      const input = screen.getByRole("textbox");
      await user.click(input);
      await user.paste("Pasted text");

      expect(handleChange).toHaveBeenCalled();
      expect(input).toHaveValue("Pasted text");
    });

    it("handles double click events", async () => {
      const user = userEvent.setup();
      const handleDoubleClick = jest.fn();

      render(
        <Input
          onDoubleClick={handleDoubleClick}
          defaultValue="Double click me"
        />
      );

      const input = screen.getByRole("textbox");
      await user.dblClick(input);

      expect(handleDoubleClick).toHaveBeenCalledTimes(1);
    });

    it("handles mouse enter and leave events", async () => {
      const user = userEvent.setup();
      const handleMouseEnter = jest.fn();
      const handleMouseLeave = jest.fn();

      render(
        <Input
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        />
      );

      const input = screen.getByRole("textbox");
      await user.hover(input);
      await user.unhover(input);

      expect(handleMouseEnter).toHaveBeenCalledTimes(1);
      expect(handleMouseLeave).toHaveBeenCalledTimes(1);
    });
  });

  describe("Accessibility", () => {
    it("has proper semantic HTML structure", () => {
      render(<Input />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input.tagName.toLowerCase()).toBe("input");
    });

    it("supports ARIA attributes", () => {
      render(
        <Input
          role="searchbox"
          aria-required="true"
          aria-invalid="false"
          aria-describedby="help-text"
        />
      );

      const input = screen.getByRole("searchbox");
      expect(input).toHaveAttribute("aria-required", "true");
      expect(input).toHaveAttribute("aria-invalid", "false");
      expect(input).toHaveAttribute("aria-describedby", "help-text");
    });

    it("supports aria-label for screen readers", () => {
      render(<Input aria-label="Email address" />);

      const input = screen.getByLabelText("Email address");
      expect(input).toBeInTheDocument();
    });

    it("supports aria-labelledby for labeling", () => {
      render(
        <>
          <label id="email-label">Email:</label>
          <Input aria-labelledby="email-label" />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-labelledby", "email-label");
    });

    it("supports aria-describedby for additional context", () => {
      render(
        <>
          <span id="email-help">We&#39;ll never share your email</span>
          <Input aria-describedby="email-help" />
        </>
      );

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-describedby", "email-help");
    });

    it("supports aria-invalid for error states", () => {
      render(<Input aria-invalid="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-invalid", "true");
    });

    it("supports aria-required for required fields", () => {
      render(<Input aria-required="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-required", "true");
    });

    it("supports aria-disabled for disabled state", () => {
      render(<Input aria-disabled="true" disabled />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-disabled", "true");
      expect(input).toHaveAttribute("disabled");
    });

    it("supports aria-expanded for expandable inputs", () => {
      render(<Input aria-expanded="false" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-expanded", "false");
    });

    it("supports aria-haspopup for inputs with popups", () => {
      render(<Input aria-haspopup="listbox" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-haspopup", "listbox");
    });

    it("supports aria-autocomplete for autocomplete inputs", () => {
      render(<Input aria-autocomplete="list" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-autocomplete", "list");
    });

    it("supports aria-multiline for textareas (when applicable)", () => {
      render(<Input aria-multiline="false" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-multiline", "false");
    });

    it("supports aria-owns for owned elements", () => {
      render(<Input aria-owns="suggestions-list" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-owns", "suggestions-list");
    });

    it("supports aria-activedescendant for active descendants", () => {
      render(<Input aria-activedescendant="option-1" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-activedescendant", "option-1");
    });

    it("supports aria-busy for busy state", () => {
      render(<Input aria-busy="false" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-busy", "false");
    });

    it("supports aria-live for live regions", () => {
      render(<Input aria-live="polite" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-live", "polite");
    });

    it("supports aria-atomic for atomic updates", () => {
      render(<Input aria-atomic="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-atomic", "true");
    });

    it("supports aria-relevant for relevant changes", () => {
      render(<Input aria-relevant="additions text" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("aria-relevant", "additions text");
    });

    it("supports role attribute customization", () => {
      render(<Input role="combobox" />);

      const input = screen.getByRole("combobox");
      expect(input).toBeInTheDocument();
    });

    it("supports title attribute for tooltips", () => {
      render(<Input title="Enter your full name" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("title", "Enter your full name");
    });

    it("supports lang attribute for language", () => {
      render(<Input lang="en" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("lang", "en");
    });

    it("supports dir attribute for text direction", () => {
      render(<Input dir="rtl" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("dir", "rtl");
    });

    it("supports accesskey for keyboard shortcuts", () => {
      render(<Input accessKey="u" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("accessKey", "u");
    });

    it("supports contenteditable for editable content", () => {
      render(<Input contentEditable="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("contentEditable", "true");
    });

    it("supports spellcheck for spell checking", () => {
      render(<Input spellCheck="true" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("spellCheck", "true");
    });

    it("supports inputmode for virtual keyboards", () => {
      render(<Input inputMode="email" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("inputMode", "email");
    });

    it("supports enterkeyhint for virtual keyboards", () => {
      render(<Input enterKeyHint="search" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("enterKeyHint", "search");
    });
  });

  describe("Integration Tests", () => {
    it("renders complete input with all features", () => {
      render(
        <Input
          type="email"
          id="email-input"
          name="email"
          placeholder="Enter your email"
          required
          className="custom-input"
          aria-label="Email address"
          aria-describedby="email-help"
          data-testid="email-field"
        />
      );

      const input = screen.getByTestId("email-field");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("id", "email-input");
      expect(input).toHaveAttribute("name", "email");
      expect(input).toHaveAttribute("placeholder", "Enter your email");
      expect(input).toHaveAttribute("required");
      expect(input).toHaveClass("custom-input");
      expect(input).toHaveAttribute("aria-label", "Email address");
      expect(input).toHaveAttribute("aria-describedby", "email-help");
    });

    it("handles form integration", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <form onSubmit={handleSubmit}>
          <Input name="username" required />
          <button type="submit">Submit</button>
        </form>
      );

      const input = screen.getByRole("textbox");
      const submitButton = screen.getByText("Submit");

      await user.type(input, "testuser");
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("handles dynamic value updates", async () => {
      const { rerender } = render(<Input value="initial" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial");

      rerender(<Input value="updated" />);

      expect(screen.getByRole("textbox")).toHaveValue("updated");
    });

    it("handles controlled component pattern", async () => {
      const user = userEvent.setup();
      const ControlledInput = () => {
        const [value, setValue] = React.useState("");
        return (
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
          />
        );
      };

      render(<ControlledInput />);

      const input = screen.getByRole("textbox");
      await user.type(input, "hello");

      expect(input).toHaveValue("HELLO");
    });

    it("handles uncontrolled component pattern", () => {
      render(<Input defaultValue="default text" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("default text");
    });

    it("handles multiple inputs with different configurations", () => {
      render(
        <>
          <Input type="text" placeholder="Text input" />
          <Input type="email" placeholder="Email input" />
          <Input type="password" placeholder="Password input" />
          <Input type="number" placeholder="Number input" />
        </>
      );

      expect(screen.getByPlaceholderText("Text input")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email input")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Password input")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Number input")).toBeInTheDocument();
    });

    it("handles input with label association", () => {
      render(
        <>
          <label htmlFor="username">Username:</label>
          <Input id="username" />
        </>
      );

      const input = screen.getByLabelText("Username:");
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute("id", "username");
    });

    it("handles input with fieldset and legend", () => {
      render(
        <fieldset>
          <legend>Contact Information</legend>
          <Input placeholder="Email" type="email" />
          <Input placeholder="Phone" type="tel" />
        </fieldset>
      );

      expect(screen.getByText("Contact Information")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Phone")).toBeInTheDocument();
    });

    it("handles number input with constraints", () => {
      render(
        <Input type="number" min="0" max="100" step="5" defaultValue="50" />
      );

      const input = screen.getByRole("spinbutton");
      expect(input).toHaveAttribute("min", "0");
      expect(input).toHaveAttribute("max", "100");
      expect(input).toHaveAttribute("step", "5");
      expect(input).toHaveValue(50);
    });

    it("handles checkbox input type", () => {
      render(<Input type="checkbox" />);

      const input = screen.getByRole("checkbox");
      expect(input).toBeInTheDocument();
    });

    it("handles radio input type", () => {
      render(<Input type="radio" />);

      const input = screen.getByRole("radio");
      expect(input).toBeInTheDocument();
    });

    it("handles range input type", () => {
      render(<Input type="range" />);

      const input = screen.getByRole("slider");
      expect(input).toBeInTheDocument();
    });
  });

  describe("Edge Cases", () => {
    it("handles empty string value", () => {
      render(<Input value="" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("");
    });

    it("handles null value gracefully", () => {
      render(<Input value={null as unknown as string} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles undefined value gracefully", () => {
      render(<Input value={undefined as unknown as string} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles numeric value conversion", () => {
      render(<Input value={123 as unknown as string} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("123");
    });

    it("handles boolean value conversion", () => {
      render(<Input value={true as unknown as string} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("true");
    });

    it("handles empty className", () => {
      render(<Input className="" />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles undefined className", () => {
      render(<Input className={undefined} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles null className", () => {
      render(<Input className={null as unknown as string} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles all props being undefined", () => {
      render(
        <Input
          type={undefined}
          className={undefined}
          value={undefined}
          placeholder={undefined}
        />
      );

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
      expect(input.tagName.toLowerCase()).toBe("input");
    });

    it("handles very long placeholder text", () => {
      const longPlaceholder =
        "This is a very long placeholder text that should still render correctly in the input field without any issues";
      render(<Input placeholder={longPlaceholder} />);

      const input = screen.getByPlaceholderText(longPlaceholder);
      expect(input).toBeInTheDocument();
    });

    it("handles very long value text", () => {
      const longValue =
        "This is a very long value text that should still render correctly in the input field without any issues or problems whatsoever";
      render(<Input value={longValue} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue(longValue);
    });

    it("handles special characters in value", () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;<>?";
      render(<Input value={specialChars} />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue(specialChars);
    });

    it("handles special characters in placeholder", () => {
      const specialChars = "!@#$%^&*()_+-=[]{}|;<>?";
      render(<Input placeholder={specialChars} />);

      const input = screen.getByPlaceholderText(specialChars);
      expect(input).toBeInTheDocument();
    });

    it("handles whitespace-only value", () => {
      render(<Input value="   " />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("   ");
    });

    it("handles multiple className strings", () => {
      render(<Input className="class1 class2   class3    class4" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveClass("class1");
      expect(input).toHaveClass("class2");
      expect(input).toHaveClass("class3");
      expect(input).toHaveClass("class4");
    });

    it("handles rapid value changes", async () => {
      const { rerender } = render(<Input value="initial" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveValue("initial");

      rerender(<Input value="updated1" />);
      expect(input).toHaveValue("updated1");

      rerender(<Input value="updated2" />);
      expect(input).toHaveValue("updated2");

      rerender(<Input value="final" />);
      expect(input).toHaveValue("final");
    });

    it("handles rapid prop changes", async () => {
      const { rerender } = render(<Input type="text" placeholder="initial" />);

      const input = screen.getByRole("textbox");
      expect(input).toHaveAttribute("type", "text");
      expect(input).toHaveAttribute("placeholder", "initial");

      rerender(<Input type="email" placeholder="updated" />);
      expect(input).toHaveAttribute("type", "email");
      expect(input).toHaveAttribute("placeholder", "updated");

      rerender(<Input type="password" placeholder="final" />);
      expect(input).toHaveAttribute("type", "password");
      expect(input).toHaveAttribute("placeholder", "final");
    });

    it("handles event handler changes", async () => {
      const user = userEvent.setup();
      const firstHandler = jest.fn();
      const secondHandler = jest.fn();

      const { rerender } = render(<Input onChange={firstHandler} />);

      const input = screen.getByRole("textbox");
      await user.type(input, "a");

      expect(firstHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).not.toHaveBeenCalled();

      rerender(<Input onChange={secondHandler} />);
      await user.type(input, "b");

      expect(firstHandler).toHaveBeenCalledTimes(1);
      expect(secondHandler).toHaveBeenCalledTimes(1);
    });

    it("handles style prop as CSS properties", () => {
      render(<Input style={{ backgroundColor: "blue", fontSize: "14px" }} />);

      const input = screen.getByRole("textbox");
      expect(input).toBeInTheDocument();
    });

    it("handles ref forwarding", () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<Input ref={inputRef} />);

      expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
      expect(inputRef.current?.tagName.toLowerCase()).toBe("input");
    });

    it("handles callback ref", () => {
      let refElement: HTMLInputElement | null = null;
      const callbackRef = (element: HTMLInputElement | null) => {
        refElement = element;
      };

      render(<Input ref={callbackRef} />);

      expect(refElement).toBeInstanceOf(HTMLInputElement);
    });

    it("handles ref updates", () => {
      const inputRef = React.createRef<HTMLInputElement>();
      const { rerender } = render(<Input ref={inputRef} value="initial" />);

      expect(inputRef.current).toBeInstanceOf(HTMLInputElement);
      expect(inputRef.current?.value).toBe("initial");

      rerender(<Input ref={inputRef} value="updated" />);
      expect(inputRef.current?.value).toBe("updated");
    });

    it("handles ref with focus", () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<Input ref={inputRef} />);

      inputRef.current?.focus();
      expect(document.activeElement).toBe(inputRef.current);
    });

    it("handles ref with value manipulation", () => {
      const inputRef = React.createRef<HTMLInputElement>();
      render(<Input ref={inputRef} />);

      if (inputRef.current) {
        inputRef.current.value = "manipulated";
        expect(inputRef.current.value).toBe("manipulated");
      }
    });

    it("handles multiple refs", () => {
      const ref1 = React.createRef<HTMLInputElement>();
      const ref2 = React.createRef<HTMLInputElement>();

      render(
        <>
          <Input ref={ref1} data-testid="input1" />
          <Input ref={ref2} data-testid="input2" />
        </>
      );

      expect(ref1.current).toBeInstanceOf(HTMLInputElement);
      expect(ref2.current).toBeInstanceOf(HTMLInputElement);
      expect(ref1.current).not.toBe(ref2.current);
    });
  });
});
