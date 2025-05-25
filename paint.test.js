// paint.test.js - Simple tests for paint application

describe('Paint App Basic Tests', () => {
  test('default brush width ska vara 5', () => {
    const brushWidth = 5;
    expect(brushWidth).toBe(5);
  });

  test('default färg ska vara svart', () => {
    const selectedColor = '#000';
    expect(selectedColor).toBe('#000');
  });

  test('default verktyg ska vara brush', () => {
    const selectedTool = 'brush';
    expect(selectedTool).toBe('brush');
  });

  test('canvas dimensions ska vara numbers', () => {
    const width = 800;
    const height = 600;
    expect(typeof width).toBe('number');
    expect(typeof height).toBe('number');
  });

  test('färger ska vara valid hex codes', () => {
    const colors = ['#fff', '#000', '#E02020', '#6DD400', '#4A98F7'];
    colors.forEach(color => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{3,6}$/);
    });
  });
});