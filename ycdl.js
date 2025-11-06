// 创建 Headers 对象并设置 Content-Type
 async function ycdl(abc,def) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "text/plain;charset=UTF-8");
  
  // 第一个请求
  const raw = `GRM=${abc}\r\nPASS=${def}`;
  
  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };
  
  // 发起第一个 fetch 请求
  async function fetchFirst() {
    try {
      const response = await fetch("http://www.yunplc.com:7080/exlog", requestOptions);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.text();
  
      // 提取 SID
      const sidRegex = /SID=(\w+)/;
      const match = result.match(sidRegex);
      if (match && match[1]) {
        const sid = match[1];
        // 存储 SID
        localStorage.setItem(abc, sid);
        // 使用提取的 SID 发起第二个请求
        
        return sid;
      } else {
        throw new Error('SID not found in the response');
      }
    } catch (error) {
      throw error;
    }
  }
  
 fetchFirst().then((sid) => {
    window.fetchSecond(sid);
  }).catch((error) => console.error(error));
  
}





