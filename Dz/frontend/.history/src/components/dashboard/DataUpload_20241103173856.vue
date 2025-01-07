<template>
  <div>
    <input type="file" id="file" />
    <button id="uploadButton">Upload</button>
    <button id="drawButton">Draw Chart</button>
    <canvas id="Chart"></canvas>
    <button id="CSVButton">Export to CSV</button>
    <button id="ExcelButton">Export to Excel</button>
    <button id="ShareLinkButton">Generate Share Link</button>
    <div id="qrcode-container">
      <img id="qrcode-image" />
    </div>
  </div>
</template>

<script>
/// <reference path="../typings/qrcode.d.ts" />
import axios from 'axios';
import XLSX from 'xlsx';
import Chart from 'chart.js';
import QRCode from 'qrcode';

let ctx;

document.addEventListener("DOMContentLoaded", function() {
    const oFile = document.querySelector('#file');
    const oUploadButton = document.querySelector('#uploadButton'); 
    const oDraw = document.querySelector('#drawButton');
    const canvas = document.getElementById('Chart');
    if (canvas) {
        ctx = canvas.getContext('2d');
    } else {
        console.error('Canvas element not found');
    }
  

    const CSV = document.querySelector('#CSVButton');
    const Excel = document.querySelector('#ExcelButton');
    const Share = document.querySelector('#ShareLinkButton');
    //const QRCodeElement = document.getElementById("qrcode");
    //const QRCodeContainer = document.getElementById("qrcode-container");
    const QRCodeImage = document.getElementById("qrcode-image");

    // 上传文件
    oUploadButton.addEventListener("click", () => {
        const file = oFile.files[0];
        uploadData(file);
    });

    //将文件绘成图表
    oDraw.addEventListener("click", () => {
        const file = oFile.files[0];
        uploadData(file)
            .then(jsonData => {
                // 在这里处理返回的jsonData数据
                console.log(jsonData);
                // 可以在这里调用其他函数，比如导出数据到 CSV 或 Excel
                drawChart(jsonData);
            })
            .catch(err => {
                console.error("An error occurred:", err);
            });
    });

    // 导出 CSV 文件
    CSV.addEventListener("click", () => {
        const file = oFile.files[0];
        uploadData(file)
            .then(jsonData => {
                // 在这里处理返回的jsonData数据
                console.log(jsonData);
                // 可以在这里调用其他函数，比如导出数据到 CSV 或 Excel
                exportToCSV(jsonData);
            })
            .catch(err => {
                console.error("An error occurred:", err);
            });
    });

    // 导出 Excel 文件
    Excel.addEventListener("click", () => {
        const file = oFile.files[0];
        uploadData(file)
            .then(jsonData => {
                // 在这里处理返回的jsonData数据
                console.log(jsonData);
                // 可以在这里调用其他函数，比如导出数据到 CSV 或 Excel
                exportToExcel(jsonData);
            })
            .catch(err => {
                console.error("An error occurred:", err);
            });
    });

    // 生成分享链接
    Share.addEventListener("click", generateShareLink);

    //let jsonData; // 声明一个全局变量来存储 Excel 数据

    // 上传数据到服务器
    function uploadData(file) {
      return new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append('file', file);

          axios.post('http://localhost:8081/file', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          }).then(() => {
              const reader = new FileReader();
              reader.onload = function(e) {
                  const data = new Uint8Array(e.target.result);
                  const workbook = XLSX.read(data, { type: 'array' });
                  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
                  const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

                  resolve(jsonData); // 将jsonData作为参数resolve
              };

              reader.readAsArrayBuffer(file);
          }).catch(err => {
              if (err.response) {
                  // 请求已经发送，服务器返回状态码在 2xx 范围之外
                  console.log('服务器响应错误:', err.response.data);
              } else if (err.request) {
                  // 请求发送过程中出现问题，没有收到服务器响应
                  console.log('请求发送失败:', err.request);
              } else {
                  // 设置请求时出现问题
                  console.log('请求设置错误:', err.message);
              }
              
              //console.error(err);
              reject(err); // 如果发生错误，reject Promise
          });
      });
    }

    // 绘制图表的函数
    function drawChart(jsonData) {
        if(!ctx) {
          console.error('Canvas context not available');
          return;
        }  
        const labels = jsonData.slice(1).map(row => {
            const excelDate = row[0]; // 假设 Excel 中的日期数据为数字
            const date = new Date((excelDate - 25569) * 86400 * 1000);
            return date.toLocaleString('en-US', { timeZone: 'UTC' });
        });

        const values = jsonData.slice(1).map(row => row[1]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Heart Rate',
                    data: values,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    fill: false
                }]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Heart Rate'
                        },
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // 生成分享链接及二维码的函数
    function generateShareLink() {
        const uniqueIdentifier = Date.now(); // 使用时间戳作为唯一标识符
        // 生成链接
        const shareLink = "http://example.com/share?id=" + uniqueIdentifier;
        console.log("Share this link with authorized people: " + shareLink);

        // 生成二维码
            /*QRCode.toCanvas(QRCodeElement, shareLink, function(error) {
                console.log('QR Code generated');
            });*/
        QRCode.toDataURL(shareLink, function(error, url) {
            if (error) {
                console.error(error);
            } else {
                QRCodeImage.src = url; // 将生成的二维码设置为图片的 src
            }
        });

        alert("Share this link with authorized people: " + shareLink);
        return shareLink;
    }
    
    // CSV文件导出函数
    function exportToCSV(jsonData) {
        if (jsonData) {
            
            const formattedData = jsonData.map(row => {
                const date = new Date((row[0] - 25569) * 86400 * 1000);
                //const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC' });
                const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
                return [formattedDate, row[1]]; // Assuming your data has date at index 0 and value at index 1
            });
            
            const csvContent = "data:text/csv;charset=utf-8," + formattedData.map(row => row.join(",")).join("\n");
            const encodedUri = encodeURI(csvContent);

            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "data.csv");

            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
        } else {
            console.error("No data available to export to CSV.");
        }
    }

    // Excel文件导出函数
    function exportToExcel(jsonData) {
        if (jsonData) {
            
            const formattedData = jsonData.map(row => {
                const date = new Date((row[0] - 25569) * 86400 * 1000);
                const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-').replace(',', '');
                //const formattedDate = date.toLocaleString('en-US', { timeZone: 'UTC' });
                return [formattedDate, row[1]]; // Assuming your data has date at index 0 and value at index 1
            });
            
            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
            XLSX.writeFile(workbook, "data.xlsx");
        } else {
            console.error("No data available to export to Excel.");
        }
    }
});
</script>
