import React from "react";
import ReactDOM from "react-dom/client";
import { ClaudeTemplateButton } from "@/components/providers/claude/template-button";
import { getPromptTemplates } from "@/options-storage";
import { waitForElement, sleep, handleSettingsClick } from "@/lib/utils";

interface Template {
  title: string;
  content: string;
}

const handleTemplateSelect = (template: Template) => {
  const editor = document.querySelector(".ProseMirror");
  if (editor instanceof HTMLElement) {
    const isEmpty = editor.querySelector(".is-editor-empty");
    if (isEmpty) {
      editor.innerHTML = "";
    }

    const p = document.createElement("p");
    p.textContent = template.content;
    editor.append(p);
    editor.focus();

    const selection = window.getSelection();
    if (selection) {
      const range = document.createRange();
      range.selectNodeContents(p);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

const initializeTemplateButton = async () => {
  const sonnetButton = await waitForElement(
    '[data-testid="model-selector-dropdown"]',
  );
  if (!sonnetButton) {
    console.error("Could not find Sonnet button");
    return;
  }

  const targetContainer = sonnetButton.parentElement;
  if (!targetContainer) {
    console.error("Could not find target container");
    return;
  }

  if (
    targetContainer.querySelector(
      '[data-testid="template-selector-dropdown-by-llm-interface-plus"]',
    )
  ) {
    return;
  }

  const templates = await getPromptTemplates();

  // Create the outer wrapper
  const templateOuterWrapper = document.createElement("div");
  templateOuterWrapper.className = "flex items-center min-w-0 max-w-full";

  // Create the inner wrapper
  const templateInnerWrapper = document.createElement("div");
  templateInnerWrapper.className = "min-w-24";
  templateInnerWrapper.setAttribute("type", "button");
  templateInnerWrapper.dataset.state = "closed";
  templateInnerWrapper.style.opacity = "1";

  // Append the inner wrapper to the outer wrapper
  templateOuterWrapper.appendChild(templateInnerWrapper);

  // Append the outer wrapper to the target container
  targetContainer.appendChild(templateOuterWrapper);

  // Create the root for the React component
  const root = ReactDOM.createRoot(templateInnerWrapper);

  // Render the React component
  root.render(
    React.createElement(ClaudeTemplateButton, {
      templates,
      onTemplateSelect: handleTemplateSelect,
      onSettingsClick: handleSettingsClick,
    }),
  );
};

export const initializeClaude = async () => {
  try {
    const options = await (await import("@/options-storage")).default.getAll();
    // Check if Claude template injection is disabled
    if (!options.enableClaudeInjection) {
      console.log("Template injection is disabled for Claude. Exiting...");
      return;
    }

    await waitForElement('[data-testid="style-selector-dropdown"]');
    await sleep(500);
    await initializeTemplateButton();
  } catch (error) {
    console.error("Failed to initialize:", error);
  }
};
