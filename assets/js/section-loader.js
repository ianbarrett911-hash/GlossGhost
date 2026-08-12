async function loadSection(container) {
  const sectionPath = container.dataset.section;
  if (!sectionPath) {
    return;
  }

  const response = await fetch(`sections/${sectionPath}.html`, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load section: ${sectionPath}`);
  }

  container.outerHTML = await response.text();
}

document.addEventListener('DOMContentLoaded', async () => {
  const containers = document.querySelectorAll('[data-section]');
  for (const container of containers) {
    try {
      await loadSection(container);
    } catch (error) {
      console.error(error);
    }
  }

  document.dispatchEvent(new CustomEvent('sections:loaded'));
});
