export function parseCSV<T = any>(csv: string): T[] {
    const [headerLine, ...lines] = csv.trim().split("\n");
    const headers = headerLine.split(",");
  
    return lines.map((line) => {
      const values = line.split(",");
      const obj: any = {};
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim();
      });
      return obj as T;
    });
  }
  