export const fetchCSV = async (url: string): Promise<string> => {
  const res = await fetch(url);
  return res.text();
};

export const getClientesCSV = () =>
  fetchCSV("https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes");

export const getContasCSV = () =>
  fetchCSV("https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas");

export const getAgenciasCSV = () =>
  fetchCSV("https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias");
