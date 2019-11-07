import axios from 'axios';

export async function files() {
  const response = await axios.get(`api/csv-s`);
  return response.data as string[];
}

export async function parse(filename: string, params: ParseParams) {
  const response = await axios.post(`api/csv/${filename}`, params);
  return response.data as ParseResponse;
}

interface ParseParams {
  separator: string;
  isHeader: boolean;
}

interface ParseResponse {
  headers: string[];
  rows: string[][];
}