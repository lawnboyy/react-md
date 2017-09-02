/** @module utils/Positoning/getSelectedTextPosition */
import getTextWidth from './getTextWidth';

const ZERO_WIDTH_CHARACTER = '\u200b';

/**
 * A utility function to attempt to get the current highlighted text position.
 *
 * When a context menu is opened, this function attempts to find the bounding client rect
 * for the highlighted text. However, if the text is in the text field, some weird stuff
 * happens and it is unable to get it correctly.
 */
export default function getSelectedTextPosition(e) {
  if (window.getSelection) {
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0).cloneRange();
      let rect = null;
      if (range.getClientRects) {
        const rects = range.getClientRects();
        if (rects.length > 0) {
          rect = rects[0];
        }
      }

      if (!rect) {
        const { target, clientX, clientY } = e;
        if (target.classList.contains('md-text-field')) {
          const { selectionStart, selectionEnd } = target;
          const selectedText = target.value.substring(selectionStart, selectionEnd);
          const width = Math.round(getTextWidth(selectedText, target)) || 0;
          const { fontSize } = window.getComputedStyle(target);

          return {
            left: clientX - width,
            top: clientY,
            width,
            height: parseInt(fontSize, 10),
          };
        }

        const span = document.createElement('span');
        span.appendChild(document.createTextNode(ZERO_WIDTH_CHARACTER));
        range.insertNode(span);
        rect = span.getBoundingClientRect();

        const spanParent = span.parentNode;
        spanParent.removeChild(span);
        spanParent.normalize();
      }

      return rect;
    }
  }

  return null;
}