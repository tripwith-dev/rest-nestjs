export function timeSince(date: string | number | Date): string {
  const now = new Date();
  const secondsPast = (now.getTime() - new Date(date).getTime()) / 1000;

  if (secondsPast < 60) {
    return `${Math.floor(secondsPast)}초 전`;
  }
  if (secondsPast < 3600) {
    return `${Math.floor(secondsPast / 60)}분 전`;
  }
  if (secondsPast < 86400) {
    return `${Math.floor(secondsPast / 3600)}시간 전`;
  }
  if (secondsPast < 2592000) {
    return `${Math.floor(secondsPast / 86400)}일 전`;
  }
  if (secondsPast < 31536000) {
    return `${Math.floor(secondsPast / 2592000)}개월 전`;
  }
  return `${Math.floor(secondsPast / 31536000)}년 전`;
}
