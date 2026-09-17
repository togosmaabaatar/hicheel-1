const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Цэс нээх');
  navigation.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Цэс хаах' : 'Цэс нээх');
  navigation.classList.toggle('open', isOpen);
});

navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && navigation.classList.contains('open')) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.header')) closeMenu();
});
window.matchMedia('(min-width: 701px)').addEventListener('change', closeMenu);

const filters = document.querySelectorAll('[data-filter]');
const projects = document.querySelectorAll('[data-category]');
filters.forEach(button => {
  button.addEventListener('click', () => {
    filters.forEach(filter => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-pressed', String(selected));
    });
    let count = 0;
    projects.forEach(project => {
      project.hidden = button.dataset.filter !== 'all' && project.dataset.category !== button.dataset.filter;
      if (!project.hidden) count++;
    });
    document.querySelector('#filter-status').textContent = `${count} төсөл харагдаж байна.`;
  });
});

const form = document.querySelector('#inquiry-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = data.get('name').trim();
  const message = data.get('message').trim();
  const status = document.querySelector('#form-status');
  if (!name || !message) {
    status.textContent = 'Нэр болон төслийн тайлбарыг бөглөнө үү.';
    form.elements[!name ? 'name' : 'message'].focus();
    return;
  }
  const content = [
    'ҮНИЙН САНАЛ АВАХ ХҮСЭЛТ',
    `Огноо: ${new Date().toLocaleDateString('mn-MN')}`,
    `Нэр: ${name}`,
    `Утас: ${data.get('phone').trim()}`,
    `Үйлчилгээ: ${data.get('service')}`,
    '', 'Төслийн тухай:', message,
    '', 'MNG Констракшн жишээ загвараар бэлтгэв. Компанид илгээгдээгүй.'
  ].join('\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF', content], { type: 'text/plain;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'barilgiin-huselt.txt';
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  status.textContent = 'Хүсэлтийн файл бэлэн боллоо. Татсан файлаа компанид өөрөө илгээнэ үү.';
});

document.querySelector('#year').textContent = new Date().getFullYear();
