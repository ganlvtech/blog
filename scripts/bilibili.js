hexo.extend.tag.register('bilibili', function(args) {
  let aid = args[0];
  let part = args[1] || 1;
  let iframe_src = 'https://player.bilibili.com/player.html?aid=' + aid + '&part=' + part;
  let a_href = 'https://www.bilibili.com/video/av' + aid;
  if (args[1]) {
    a_href += '?p=' + part;
  }
  return `
<div class="video-container">
    <iframe src="${iframe_src}" scrolling="no" border="0" frameborder="no" framespacing="0" allowfullscreen="true"></iframe>
</div>
<p>
    <span class="caption"><a href="${a_href}" target="_blank" rel="noopener">${a_href}</a></span>
</p>`;
});
