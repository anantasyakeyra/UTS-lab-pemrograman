const form = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const formError = document.getElementById('formError');
const listError = document.getElementById('listError');
const emptyState = document.getElementById('emptyState');
const tableBody = document.getElementById('studentTableBody');
const detailDialog = document.getElementById('detailDialog');
const detailContent = document.getElementById('detailContent');
const closeDetail = document.getElementById('closeDetail');

let editingNim = null;

const fields = {
  nim: document.getElementById('nim'),
  nama: document.getElementById('nama'),
  program_studi: document.getElementById('program_studi'),
  angkatan: document.getElementById('angkatan'),
  ipk: document.getElementById('ipk'),
};

function showErrors(container, errors) {
  if (!errors || !errors.length) {
    container.hidden = true;
    container.textContent = '';
    return;
  }
  container.hidden = false;
  container.textContent = errors.join(' ');
}

function formData() {
  return {
    nim: fields.nim.value,
    nama: fields.nama.value,
    program_studi: fields.program_studi.value,
    angkatan: fields.angkatan.value,
    ipk: fields.ipk.value,
  };
}

function resetForm() {
  form.reset();
  editingNim = null;
  fields.nim.disabled = false;
  formTitle.textContent = 'Tambah Mahasiswa';
  submitBtn.textContent = 'Simpan';
  cancelBtn.hidden = true;
  showErrors(formError, []);
}

async function loadStudents() {
  showErrors(listError, []);
  try {
    const response = await fetch('/api/mahasiswa');
    const result = await response.json();
    if (!result.ok) {
      showErrors(listError, result.errors);
      return;
    }
    renderStudents(result.data);
  } catch (error) {
    showErrors(listError, ['Gagal memuat data.']);
  }
}

function renderStudents(students) {
  tableBody.innerHTML = '';
  emptyState.hidden = students.length !== 0;

  for (const student of students) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${escapeHtml(student.nim)}</td>
      <td>${escapeHtml(student.nama)}</td>
      <td>${escapeHtml(student.program_studi)}</td>
      <td>${escapeHtml(student.angkatan)}</td>
      <td>${escapeHtml(student.ipk)}</td>
      <td>${escapeHtml(student.lama_studi)}</td>
      <td class="actions-cell">
        <button type="button" class="small" data-action="detail" data-nim="${student.nim}">Detail</button>
        <button type="button" class="small" data-action="edit" data-nim="${student.nim}">Ubah</button>
        <button type="button" class="small danger" data-action="delete" data-nim="${student.nim}">Hapus</button>
      </td>
    `;
    tableBody.appendChild(row);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function findStudent(nim) {
  const response = await fetch(`/api/mahasiswa/${nim}`);
  const result = await response.json();
  if (!result.ok) throw new Error((result.errors || []).join(' '));
  return result.data;
}

async function submitForm(event) {
  event.preventDefault();
  showErrors(formError, []);

  const payload = formData();
  let url = '/api/mahasiswa';
  let method = 'POST';

  if (editingNim !== null) {
    url = `/api/mahasiswa/${editingNim}`;
    method = 'PUT';
    delete payload.nim;
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!result.ok) {
      showErrors(formError, result.errors);
      return;
    }
    resetForm();
    await loadStudents();
  } catch (error) {
    showErrors(formError, ['Gagal menyimpan data.']);
  }
}

async function handleTableClick(event) {
  const button = event.target.closest('button[data-action]');
  if (!button) return;

  const action = button.dataset.action;
  const nim = button.dataset.nim;

  if (action === 'detail') {
    try {
      const student = await findStudent(nim);
      detailContent.innerHTML = `
        <dl>
          <dt>NIM</dt><dd>${escapeHtml(student.nim)}</dd>
          <dt>Nama</dt><dd>${escapeHtml(student.nama)}</dd>
          <dt>Program Studi</dt><dd>${escapeHtml(student.program_studi)}</dd>
          <dt>Angkatan</dt><dd>${escapeHtml(student.angkatan)}</dd>
          <dt>IPK</dt><dd>${escapeHtml(student.ipk)}</dd>
          <dt>Lama Studi</dt><dd>${escapeHtml(student.lama_studi)} tahun</dd>
        </dl>
      `;
      detailDialog.showModal();
    } catch (error) {
      showErrors(listError, [error.message || 'Gagal memuat detail.']);
    }
  }

  if (action === 'edit') {
    try {
      const student = await findStudent(nim);
      editingNim = student.nim;
      fields.nim.value = student.nim;
      fields.nim.disabled = true;
      fields.nama.value = student.nama;
      fields.program_studi.value = student.program_studi;
      fields.angkatan.value = student.angkatan;
      fields.ipk.value = student.ipk;
      formTitle.textContent = 'Ubah Mahasiswa';
      submitBtn.textContent = 'Perbarui';
      cancelBtn.hidden = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      showErrors(listError, [error.message || 'Gagal memuat data.']);
    }
  }

  if (action === 'delete') {
    if (!confirm('Hapus mahasiswa ini?')) return;
    try {
      const response = await fetch(`/api/mahasiswa/${nim}`, { method: 'DELETE' });
      const result = await response.json();
      if (!result.ok) {
        showErrors(listError, result.errors);
        return;
      }
      await loadStudents();
    } catch (error) {
      showErrors(listError, ['Gagal menghapus data.']);
    }
  }
}

form.addEventListener('submit', submitForm);
cancelBtn.addEventListener('click', resetForm);
tableBody.addEventListener('click', handleTableClick);
closeDetail.addEventListener('click', () => detailDialog.close());

loadStudents();
resetForm();
