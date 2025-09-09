const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchRules() {
  const res = await fetch(`${API_BASE_URL}/api/rules`);
  if (!res.ok) throw new Error('Failed to fetch rules');
  return res.json();
}

export async function saveRules(rules: any) {
  const res = await fetch(`${API_BASE_URL}/api/rules`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(rules),
  });
  if (!res.ok) throw new Error('Failed to save rules');
  return res.json();
}

export async function scanContract(contractText: string, rules: any) {
  const res = await fetch(`${API_BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contractText, rules }),
  });
  if (!res.ok) throw new Error('Failed to scan contract');
  return res.json();
}