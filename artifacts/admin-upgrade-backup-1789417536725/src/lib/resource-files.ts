export const resourceFileTypes: Record<string,string> = { pdf:"application/pdf",xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",jpg:"image/jpeg",png:"image/png",webp:"image/webp",mp4:"video/mp4",webm:"video/webm" };
export function validResourceFile(ext:string,buffer:Buffer) {
  if(ext === "pdf") return buffer.subarray(0,5).toString() === "%PDF-";
  if(ext === "xlsx") return buffer.subarray(0,4).equals(Buffer.from([80,75,3,4])) && buffer.includes(Buffer.from("[Content_Types].xml")) && buffer.includes(Buffer.from("xl/workbook.xml"));
  if(ext === "jpg") return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  if(ext === "png") return buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));
  if(ext === "webp") return buffer.subarray(0,4).toString() === "RIFF" && buffer.subarray(8,12).toString() === "WEBP";
  if(ext === "mp4") return buffer.subarray(4,8).toString() === "ftyp";
  if(ext === "webm") return buffer.subarray(0,4).equals(Buffer.from([26,69,223,163]));
  return false;
}
export function parseResourceRange(range:string | null,size:number): {start:number;end:number} | null | false {
  if(!range) return null;
  const match=/^bytes=(\d*)-(\d*)$/.exec(range);
  if(!match || (!match[1] && !match[2])) return false;
  const start=match[1] ? Number(match[1]) : Math.max(0,size-Number(match[2]));
  const end=match[1] && match[2] ? Math.min(size-1,Number(match[2])) : size-1;
  return Number.isSafeInteger(start) && Number.isSafeInteger(end) && start>=0 && start<=end && start<size ? {start,end} : false;
}
