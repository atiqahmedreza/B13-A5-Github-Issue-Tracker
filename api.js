const BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab";


async function getAllIssues() {
  const res = await fetch(`${BASE_URL}/issues`);
  const json = await res.json();
  return json.data;
}


async function getIssueById(id) {
  const res = await fetch(`${BASE_URL}/issue/${id}`);
  const json = await res.json();
  return json.data;
}


async function searchIssues(query) {
  const res = await fetch(`${BASE_URL}/issues/search?q=${encodeURIComponent(query)}`);
  const json = await res.json();
  return json.data;
}
