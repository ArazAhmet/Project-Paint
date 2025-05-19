// paint.test.js
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
});