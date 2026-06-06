const cheerio = require('cheerio');
fetch('https://www.ssbwiki.com/Chronicle').then(r => r.text()).then(t => {
  const $ = cheerio.load(t);
  const n64 = $('.tabber').eq(6);
  let links = {};
  n64.find('.tabbertab').each((i, tab) => {
    let region = $(tab).attr('title');
    $(tab).find('tr').each((j, row) => {
      let td = $(row).find('td');
      if(td.length >= 2) {
        let a = $(td[1]).find('a').first();
        let href = a.attr('href');
        let title = $(td[1]).text().trim();
        if(href) {
          if(!links[href]) links[href] = {};
          links[href][region] = title;
        }
      }
    });
  });
  console.log(JSON.stringify(links, null, 2).substring(0, 1000));
});
