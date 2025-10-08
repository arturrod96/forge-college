import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  it('renders the initial value', async () => {
    render(<MarkdownEditor value={'# Title'} onChange={() => {}} />);

    expect(await screen.findByDisplayValue('# Title')).toBeInTheDocument();
  });

  it('calls onChange when text updates', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<MarkdownEditor value="" onChange={handleChange} />);

    const textarea = await screen.findByRole('textbox');
    await user.type(textarea, 'Hello');

    expect(handleChange).toHaveBeenCalled();
  });
});
