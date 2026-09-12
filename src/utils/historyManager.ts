/**
 * Robust Undo/Redo History Manager for contentEditable rich text editing
 */

export class DocumentHistory {
  private past: string[] = [];
  private future: string[] = [];
  private current: string = '';
  private timer: ReturnType<typeof setTimeout> | null = null;
  private onChangeListeners: Array<(canUndo: boolean, canRedo: boolean) => void> = [];

  constructor(initialContent: string) {
    this.current = initialContent;
  }

  public subscribe(listener: (canUndo: boolean, canRedo: boolean) => void) {
    this.onChangeListeners.push(listener);
    listener(this.canUndo(), this.canRedo());
    return () => {
      this.onChangeListeners = this.onChangeListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const u = this.canUndo();
    const r = this.canRedo();
    this.onChangeListeners.forEach((fn) => fn(u, r));
  }

  /**
   * Reset history when switching to a different document
   */
  public reset(content: string) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.past = [];
    this.future = [];
    this.current = content;
    this.notify();
  }

  /**
   * Immediately snapshot before or after a discrete action
   * (e.g. bold, table insertion, font change, delete, clear, etc.)
   */
  public snapshot(newContent: string) {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (newContent === this.current) return;

    this.past.push(this.current);
    if (this.past.length > 80) {
      this.past.shift();
    }
    this.future = [];
    this.current = newContent;
    this.notify();
  }

  /**
   * Debounced snapshot for user typing
   */
  public recordTyping(newContent: string) {
    if (newContent === this.current) return;
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Check if user finished a word or created a new block
    const isWordBreak =
      newContent.endsWith(' ') ||
      newContent.endsWith('&nbsp;') ||
      newContent.endsWith('</p>') ||
      newContent.endsWith('<br>') ||
      Math.abs(newContent.length - this.current.length) > 15;

    const delay = isWordBreak ? 350 : 700;

    this.timer = setTimeout(() => {
      this.snapshot(newContent);
    }, delay);
  }

  public canUndo(): boolean {
    return this.past.length > 0;
  }

  public canRedo(): boolean {
    return this.future.length > 0;
  }

  /**
   * Undo to the previous content snapshot
   */
  public undo(): string | null {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.past.length === 0) return null;

    const previous = this.past.pop()!;
    this.future.push(this.current);
    this.current = previous;
    this.notify();
    return previous;
  }

  /**
   * Redo to the next content snapshot
   */
  public redo(): string | null {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    if (this.future.length === 0) return null;

    const next = this.future.pop()!;
    this.past.push(this.current);
    this.current = next;
    this.notify();
    return next;
  }

  public getCurrent(): string {
    return this.current;
  }
}
