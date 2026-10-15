import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoardPage } from './board-page';

describe('BoardPage', () => {
  let fixture: ComponentFixture<BoardPage>;
  let el: HTMLElement;

  const text = (node: Element) => node.textContent?.replace(/\s+/g, ' ').trim() ?? '';
  const columns = () => Array.from(el.querySelectorAll('section'));
  const column = (label: string) => {
    const match = columns().find((c) => text(c.querySelector('h3')!).startsWith(label));
    if (!match) throw new Error(`No column labelled "${label}"`);
    return match;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoardPage],
    }).compileComponents();

    fixture = TestBed.createComponent(BoardPage);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('renders one column per status in workflow order, with task counts', () => {
    const headings = columns().map((c) => text(c.querySelector('h3')!));

    expect(headings).toEqual(['To do 2', 'In progress 1', 'In review 0', 'Done 1']);
  });

  it('renders each task as a card in its column', () => {
    const cards = Array.from(column('To do').querySelectorAll('li')).map(text);

    expect(cards).toEqual(['Write release notes', 'Fix login redirect']);
  });

  it('shows an empty state for a column with no tasks', () => {
    const items = column('In review').querySelectorAll('li');

    expect(items.length).toBe(1);
    expect(text(items[0])).toBe('No tasks');
  });

  it('labels each column region by its own heading', () => {
    for (const section of columns()) {
      const labelId = section.getAttribute('aria-labelledby');
      const heading = section.querySelector('h3')!;

      expect(labelId).toBeTruthy();
      expect(heading.id).toBe(labelId);
    }
  });

  it('uses an h2 for the page title so the shell keeps the only h1', () => {
    expect(el.querySelector('h1')).toBeNull();
    expect(text(el.querySelector('h2')!)).toBe('Board');
  });
});
