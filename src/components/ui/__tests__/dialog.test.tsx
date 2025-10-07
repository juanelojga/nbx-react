import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";

describe("Dialog Component", () => {
  describe("Dialog Rendering", () => {
    it("renders dialog trigger button", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveAttribute("data-slot", "dialog-trigger");
    });

    it("renders dialog with all subcomponents", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog Title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
            <div>Dialog content</div>
            <DialogFooter>
              <button>Cancel</button>
              <button>Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with custom className", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="custom-dialog">
            <DialogTitle>Custom Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with showCloseButton false", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>No Close Button</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with numeric content", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>{42}</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with special characters", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>!@#$%^&*()</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with long text content", () => {
      const longText =
        "This is a very long dialog title that should still render correctly";
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>{longText}</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with nested elements", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>
              <strong>Bold</strong> and <em>italic</em> text
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("handles empty dialog content gracefully", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent data-testid="empty-dialog" />
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("renders dialog with SVG icons", () => {
      render(
        <Dialog>
          <DialogTrigger>
            <svg data-testid="trigger-icon" />
            Open Dialog
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>
              <svg data-testid="title-icon" />
              Dialog Title
            </DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByTestId("trigger-icon")).toBeInTheDocument();
      expect(screen.getByTestId("title-icon")).toBeInTheDocument();
    });
  });

  describe("Dialog User Interactions", () => {
    it("opens dialog when trigger is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });
    });

    it("closes dialog when close button is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText("Close");
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      });
    });

    it("closes dialog when DialogClose is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogClose>Custom Close</DialogClose>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      const closeButton = screen.getByText("Custom Close");
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      });
    });

    it("closes dialog when overlay is clicked", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      const overlay = screen.getByTestId("dialog-overlay");
      await user.click(overlay);

      await waitFor(() => {
        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      });
    });

    it("handles keyboard navigation with Escape key", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      await user.keyboard("{Escape}");

      await waitFor(() => {
        expect(screen.queryByText("Dialog Title")).not.toBeInTheDocument();
      });
    });

    it("handles focus management when dialog opens", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            <button>Focusable button</button>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Dialog Title")).toBeInTheDocument();
      });

      const focusableButton = screen.getByText("Focusable button");
      focusableButton.focus();
      expect(document.activeElement).toBe(focusableButton);
    });

    it("handles multiple dialog triggers", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Dialog>
            <DialogTrigger>First Dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>First Dialog Title</DialogTitle>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>Second Dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>Second Dialog Title</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );

      const firstTrigger = screen.getByText("First Dialog");
      const secondTrigger = screen.getByText("Second Dialog");

      await user.click(firstTrigger);
      await waitFor(() => {
        expect(screen.getByText("First Dialog Title")).toBeInTheDocument();
      });

      await user.click(secondTrigger);
      await waitFor(() => {
        expect(screen.getByText("Second Dialog Title")).toBeInTheDocument();
      });
    });

    it("handles form submission within dialog", async () => {
      const user = userEvent.setup();
      const handleSubmit = jest.fn((e) => e.preventDefault());

      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Enter text" />
              <button type="submit">Submit</button>
            </form>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
      });

      const input = screen.getByPlaceholderText("Enter text");
      await user.type(input, "Test input");

      const submitButton = screen.getByText("Submit");
      await user.click(submitButton);

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });
  });

  describe("Dialog Accessibility", () => {
    it("has proper ARIA attributes for dialog", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Accessible Dialog</DialogTitle>
            <DialogDescription>This is a dialog description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toBeInTheDocument();
        expect(dialog).toHaveAttribute("aria-labelledby");
        expect(dialog).toHaveAttribute("aria-describedby");
      });

      const title = screen.getByText("Accessible Dialog");
      const description = screen.getByText("This is a dialog description");
      expect(title).toHaveAttribute("id");
      expect(description).toHaveAttribute("id");
    });

    it("supports aria-label for dialog trigger", () => {
      render(
        <Dialog>
          <DialogTrigger aria-label="Open settings dialog">
            Settings
          </DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByLabelText("Open settings dialog");
      expect(trigger).toBeInTheDocument();
      expect(trigger).toHaveTextContent("Settings");
    });

    it("supports aria-describedby for dialog content", async () => {
      const user = userEvent.setup();
      render(
        <>
          <span id="dialog-help">Additional help text</span>
          <Dialog>
            <DialogTrigger>Open Dialog</DialogTrigger>
            <DialogContent aria-describedby="dialog-help">
              <DialogTitle>Help Dialog</DialogTitle>
            </DialogContent>
          </Dialog>
        </>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveAttribute("aria-describedby", "dialog-help");
      });
    });

    it("maintains focus trap within dialog", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Focus Trap Dialog</DialogTitle>
            <button>First button</button>
            <button>Second button</button>
            <button>Third button</button>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Focus Trap Dialog")).toBeInTheDocument();
      });

      const firstButton = screen.getByText("First button");
      const secondButton = screen.getByText("Second button");
      const thirdButton = screen.getByText("Third button");

      firstButton.focus();
      expect(document.activeElement).toBe(firstButton);

      await user.tab();
      expect(document.activeElement).toBe(secondButton);

      await user.tab();
      expect(document.activeElement).toBe(thirdButton);
    });

    it("supports screen reader only text for close button", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog with Close</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        const closeButton = screen.getByLabelText("Close");
        expect(closeButton).toBeInTheDocument();
        expect(closeButton).toHaveAttribute("data-slot", "dialog-close");
      });
    });

    it("supports semantic HTML structure", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Semantic Dialog</DialogTitle>
            </DialogHeader>
            <DialogDescription>Semantic description</DialogDescription>
            <DialogFooter>
              <button>Action</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("Semantic Dialog")).toBeInTheDocument();
        expect(screen.getByText("Semantic description")).toBeInTheDocument();
      });
    });
  });

  describe("Dialog Conditional Rendering", () => {
    it("renders dialog based on conditional state", () => {
      const { rerender } = render(
        <Dialog open={true}>
          <DialogTrigger>Trigger</DialogTrigger>
          <DialogContent>
            <DialogTitle>Conditional Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.getByText("Conditional Dialog")).toBeInTheDocument();

      rerender(
        <Dialog open={false}>
          <DialogTrigger>Trigger</DialogTrigger>
          <DialogContent>
            <DialogTitle>Conditional Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText("Conditional Dialog")).not.toBeInTheDocument();
    });

    it("renders dialog content with dynamic props", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="first-class">
            <DialogTitle>First Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveClass("first-class");
        expect(screen.getByText("First Title")).toBeInTheDocument();
      });

      rerender(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="second-class">
            <DialogTitle>Second Title</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveClass("second-class");
        expect(screen.getByText("Second Title")).toBeInTheDocument();
      });
    });

    it("handles dialog with conditional close button", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent showCloseButton={true}>
            <DialogTitle>With Close Button</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByLabelText("Close")).toBeInTheDocument();
      });

      rerender(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent showCloseButton={false}>
            <DialogTitle>Without Close Button</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      await waitFor(() => {
        expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
      });
    });

    it("renders dialog with conditional footer", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            {true && (
              <DialogFooter>
                <button>Cancel</button>
                <button>Save</button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Save")).toBeInTheDocument();
      });

      rerender(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Dialog Title</DialogTitle>
            {false && (
              <DialogFooter>
                <button>Cancel</button>
                <button>Save</button>
              </DialogFooter>
            )}
          </DialogContent>
        </Dialog>
      );

      await waitFor(() => {
        expect(screen.queryByText("Cancel")).not.toBeInTheDocument();
        expect(screen.queryByText("Save")).not.toBeInTheDocument();
      });
    });
  });

  describe("Dialog Edge Cases", () => {
    it("handles null children gracefully", () => {
      render(
        <Dialog>
          <DialogTrigger>{null}</DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByTestId("dialog-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("handles undefined children gracefully", () => {
      render(
        <Dialog>
          <DialogTrigger>{undefined}</DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByTestId("dialog-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("handles boolean children gracefully", () => {
      render(
        <Dialog>
          <DialogTrigger>{true}</DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByTestId("dialog-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("handles zero as children", () => {
      render(
        <Dialog>
          <DialogTrigger>{0}</DialogTrigger>
        </Dialog>
      );

      expect(screen.getByText("0")).toBeInTheDocument();
    });

    it("handles whitespace content", () => {
      render(
        <Dialog>
          <DialogTrigger> </DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByTestId("dialog-trigger");
      expect(trigger).toBeInTheDocument();
    });

    it("handles very long single word in title", async () => {
      const user = userEvent.setup();
      const longWord = "supercalifragilisticexpialidocious";
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>{longWord}</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText(longWord)).toBeInTheDocument();
      });
    });

    it("handles multiple className props", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="class1 class2 class3">
            <DialogTitle>Multiple Classes</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveClass("class1");
        expect(dialog).toHaveClass("class2");
        expect(dialog).toHaveClass("class3");
      });
    });

    it("handles empty string className", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className="">
            <DialogTitle>Empty Class</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Empty Class")).toBeInTheDocument();
      });
    });

    it("handles undefined className", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className={undefined}>
            <DialogTitle>Undefined Class</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Undefined Class")).toBeInTheDocument();
      });
    });

    it("handles all props being undefined", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent className={undefined} showCloseButton={undefined}>
            <DialogTitle>All Undefined</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("All Undefined")).toBeInTheDocument();
      });
    });

    it("handles dialog with no trigger", () => {
      render(
        <Dialog>
          <DialogContent>
            <DialogTitle>No Trigger Dialog</DialogTitle>
          </DialogContent>
        </Dialog>
      );

      expect(screen.queryByText("No Trigger Dialog")).not.toBeInTheDocument();
    });

    it("handles dialog with no content", () => {
      render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      expect(trigger).toBeInTheDocument();
    });

    it("handles nested dialogs", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Outer Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Outer Dialog</DialogTitle>
            <Dialog>
              <DialogTrigger>Open Inner Dialog</DialogTrigger>
              <DialogContent>
                <DialogTitle>Inner Dialog</DialogTitle>
              </DialogContent>
            </Dialog>
          </DialogContent>
        </Dialog>
      );

      const outerTrigger = screen.getByText("Open Outer Dialog");
      await user.click(outerTrigger);

      await waitFor(() => {
        expect(screen.getByText("Outer Dialog")).toBeInTheDocument();
      });

      const innerTrigger = screen.getByText("Open Inner Dialog");
      await user.click(innerTrigger);

      await waitFor(() => {
        expect(screen.getByText("Inner Dialog")).toBeInTheDocument();
      });
    });
  });

  describe("Dialog Integration Tests", () => {
    it("renders complete dialog with all features", async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();

      render(
        <Dialog>
          <DialogTrigger className="trigger-class" id="trigger-button">
            <svg data-testid="trigger-icon" />
            Open Complete Dialog
          </DialogTrigger>
          <DialogContent
            className="content-class"
            showCloseButton={true}
            onEscapeKeyDown={handleClose}
          >
            <DialogHeader className="header-class">
              <DialogTitle className="title-class">Complete Dialog</DialogTitle>
              <DialogDescription className="description-class">
                This is a complete dialog with all features
              </DialogDescription>
            </DialogHeader>
            <div className="dialog-body">
              <p>Dialog body content</p>
              <input type="text" placeholder="Enter text" />
            </div>
            <DialogFooter className="footer-class">
              <DialogClose>Cancel</DialogClose>
              <button className="confirm-button">Confirm</button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Complete Dialog");
      expect(trigger).toHaveClass("trigger-class");
      expect(trigger).toHaveAttribute("id", "trigger-button");
      expect(screen.getByTestId("trigger-icon")).toBeInTheDocument();

      await user.click(trigger);

      await waitFor(() => {
        const dialog = screen.getByRole("dialog");
        expect(dialog).toHaveClass("content-class");
        expect(screen.getByText("Complete Dialog")).toHaveClass("title-class");
        expect(
          screen.getByText("This is a complete dialog with all features")
        ).toHaveClass("description-class");
        expect(screen.getByText("Dialog body content")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
        expect(screen.getByText("Cancel")).toBeInTheDocument();
        expect(screen.getByText("Confirm")).toBeInTheDocument();
      });
    });

    it("renders multiple dialogs with different configurations", async () => {
      const user = userEvent.setup();
      render(
        <>
          <Dialog>
            <DialogTrigger>Info Dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>Information</DialogTitle>
              <DialogDescription>This is an info dialog</DialogDescription>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>Warning Dialog</DialogTrigger>
            <DialogContent showCloseButton={false}>
              <DialogTitle>Warning</DialogTitle>
              <DialogDescription>This is a warning dialog</DialogDescription>
              <DialogFooter>
                <button>Acknowledge</button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog>
            <DialogTrigger>Error Dialog</DialogTrigger>
            <DialogContent>
              <DialogTitle>Error</DialogTitle>
              <DialogDescription>This is an error dialog</DialogDescription>
            </DialogContent>
          </Dialog>
        </>
      );

      const infoTrigger = screen.getByText("Info Dialog");
      const warningTrigger = screen.getByText("Warning Dialog");
      screen.getByText("Error Dialog");

      await user.click(infoTrigger);
      await waitFor(() => {
        expect(screen.getByText("Information")).toBeInTheDocument();
        expect(screen.getByLabelText("Close")).toBeInTheDocument();
      });

      const closeButton = screen.getByLabelText("Close");
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText("Information")).not.toBeInTheDocument();
      });

      await user.click(warningTrigger);
      await waitFor(() => {
        expect(screen.getByText("Warning")).toBeInTheDocument();
        expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
        expect(screen.getByText("Acknowledge")).toBeInTheDocument();
      });
    });

    it("handles dynamic content updates", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Initial Title</DialogTitle>
            <DialogDescription>Initial description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Initial Title")).toBeInTheDocument();
        expect(screen.getByText("Initial description")).toBeInTheDocument();
      });

      rerender(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Updated Title</DialogTitle>
            <DialogDescription>Updated description</DialogDescription>
          </DialogContent>
        </Dialog>
      );

      await waitFor(() => {
        expect(screen.getByText("Updated Title")).toBeInTheDocument();
        expect(screen.getByText("Updated description")).toBeInTheDocument();
        expect(screen.queryByText("Initial Title")).not.toBeInTheDocument();
        expect(
          screen.queryByText("Initial description")
        ).not.toBeInTheDocument();
      });
    });

    it("handles loading state pattern", async () => {
      const user = userEvent.setup();
      const { rerender } = render(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Loading Dialog</DialogTitle>
            <div>
              <svg data-testid="loading-spinner" className="animate-spin" />
              Loading...
            </div>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
        expect(screen.getByText("Loading...")).toBeInTheDocument();
      });

      rerender(
        <Dialog>
          <DialogTrigger>Open Dialog</DialogTrigger>
          <DialogContent>
            <DialogTitle>Loaded Dialog</DialogTitle>
            <div>Content loaded!</div>
          </DialogContent>
        </Dialog>
      );

      await waitFor(() => {
        expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
        expect(screen.getByText("Content loaded!")).toBeInTheDocument();
      });
    });

    it("renders with complex nested structure", async () => {
      const user = userEvent.setup();
      render(
        <Dialog>
          <DialogTrigger>Open Complex Dialog</DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <span>
                  <strong>Complex</strong> <em>nested</em> title
                </span>
                <svg data-testid="title-icon" />
              </DialogTitle>
              <DialogDescription>
                <div>
                  <p>Nested description content</p>
                  <ul>
                    <li>Item 1</li>
                    <li>Item 2</li>
                  </ul>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div>
              <form>
                <label>
                  Name:
                  <input type="text" placeholder="Enter name" />
                </label>
                <label>
                  Email:
                  <input type="email" placeholder="Enter email" />
                </label>
              </form>
            </div>
            <DialogFooter>
              <div>
                <button>Reset</button>
                <button>Submit</button>
              </div>
              <p>Footer text</p>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );

      const trigger = screen.getByText("Open Complex Dialog");
      await user.click(trigger);

      await waitFor(() => {
        expect(screen.getByText("Complex")).toBeInTheDocument();
        expect(screen.getByText("nested")).toBeInTheDocument();
        expect(screen.getByText("title")).toBeInTheDocument();
        expect(screen.getByTestId("title-icon")).toBeInTheDocument();
        expect(
          screen.getByText("Nested description content")
        ).toBeInTheDocument();
        expect(screen.getByText("Item 1")).toBeInTheDocument();
        expect(screen.getByText("Item 2")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter name")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
        expect(screen.getByText("Reset")).toBeInTheDocument();
        expect(screen.getByText("Submit")).toBeInTheDocument();
        expect(screen.getByText("Footer text")).toBeInTheDocument();
      });
    });
  });
});
