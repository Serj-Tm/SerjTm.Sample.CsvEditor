import axios from 'axios';

export async function process(filename: string, params: ProcessParams) {
  const response = await axios.get(`api/csv/${filename}`, { params });
  return response.data as ProcessResponse;
}

interface ProcessParams {
  separator: string;
  isHeader: boolean;
}

interface ProcessResponse {
  headers: string[];
  rows: string[][];
}