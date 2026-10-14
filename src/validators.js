function toInteger(value) {
  if (typeof value === 'number') {
    return Number.isInteger(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!/^-?\d+$/.test(trimmed)) return null;
    const n = Number(trimmed);
    return Number.isSafeInteger(n) ? n : null;
  }
  return null;
}

function toFloat(value) {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  if (typeof value === 'boolean') return null;
  return null;
}

function requiredText(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed === '' ? null : trimmed;
}

function validateCreate(payload) {
  const errors = [];
  const data = {};

  const nim = toInteger(payload && payload.nim);
  if (nim === null) errors.push('NIM wajib berupa bilangan bulat.');
  else data.nim = nim;

  const nama = requiredText(payload && payload.nama);
  if (!nama) errors.push('Nama wajib diisi.');
  else data.nama = nama;

  const programStudi = requiredText(payload && payload.program_studi);
  if (!programStudi) errors.push('Program studi wajib diisi.');
  else data.program_studi = programStudi;

  const angkatan = toInteger(payload && payload.angkatan);
  if (angkatan === null) errors.push('Angkatan wajib berupa bilangan bulat.');
  else data.angkatan = angkatan;

  const ipk = toFloat(payload && payload.ipk);
  if (ipk === null || ipk < 0 || ipk > 4) {
    errors.push('IPK wajib berupa angka antara 0.00 dan 4.00.');
  } else {
    data.ipk = ipk;
  }

  return errors.length ? { ok: false, errors } : { ok: true, data };
}

function validateUpdate(payload) {
  const errors = [];
  const data = {};

  const nama = requiredText(payload && payload.nama);
  if (!nama) errors.push('Nama wajib diisi.');
  else data.nama = nama;

  const programStudi = requiredText(payload && payload.program_studi);
  if (!programStudi) errors.push('Program studi wajib diisi.');
  else data.program_studi = programStudi;

  const angkatan = toInteger(payload && payload.angkatan);
  if (angkatan === null) errors.push('Angkatan wajib berupa bilangan bulat.');
  else data.angkatan = angkatan;

  const ipk = toFloat(payload && payload.ipk);
  if (ipk === null || ipk < 0 || ipk > 4) {
    errors.push('IPK wajib berupa angka antara 0.00 dan 4.00.');
  } else {
    data.ipk = ipk;
  }

  return errors.length ? { ok: false, errors } : { ok: true, data };
}

module.exports = { validateCreate, validateUpdate };
