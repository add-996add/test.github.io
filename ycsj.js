// 第二个请求

 async function fetchSecond(sid) {
  const myHeaders = new Headers();
  // 注意：这里可能不需要设置Content-Type，具体取决于第二个请求的需求
  // myHeaders.append("Content-Type", "application/javascript"); // 或者其他适当的类型

  // 注意：这里使用了模板字符串来插入SID
  const url = `http://47.114.53.27:7080/exdata?SID=${sid}&OP=R`;

  const raw = "2\r\n进水瞬时流量\r\n$NetTraffic";

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  try {
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error('Second network response was not ok');
    }
    const result = await response.text();
    //console.log(result); // 在控制台输出数据
    
     // 将结果按行分割
    const lines = result.split(/\r?\n/);
    localStorage.setItem("jk",result);
    const jk1 = localStorage.getItem("jk");
    const ok = jk1.split(/\r?\n/);
    console.log(ok);
    localStorage.setItem("jk1",ok[2]);
    //localStorage.setItem(lines);

    setTimeout(() => fetchSecond(getSidFromLocalStorage()), 100); // 每秒刷新一次
  } catch (error) {
    console.error(error);
    // 如果发生错误，检查是否需要重新登录
    handleLoginError(error);
  
  }
  
}

// 获取 SID 从 localStorage
function getSidFromLocalStorage() {
  return localStorage.getItem("sid") || null;
}

// 处理登录错误
async function handleLoginError(error) {
  console.error("Error occurred:", error);
  // 如果错误与 SID 有关，尝试重新登录
  if (error.message.includes("SID")) {
    try {
      const newSid = await fetchFirst();
      fetchSecond(newSid);
    } catch (error) {
      console.error("Failed to re-login:", error);
    }
  } else {
    // 其他错误处理
    console.error("Other error:", error);
  }
}

// 导出 fetchSecond 函数供外部调用
window.fetchSecond = fetchSecond;

