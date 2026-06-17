async function testWikidata() {
  const wikiUrl = "https://en.wikipedia.org/wiki/SimCity";
  const title = wikiUrl.split('/').pop()!;
  
  // 1. Get Wikidata ID from Wikipedia title
  const wpRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&prop=pageprops&titles=${title}&format=json`);
  const wpData = await wpRes.json();
  const pages = wpData.query.pages;
  const pageId = Object.keys(pages)[0];
  const wikidataId = pages[pageId].pageprops?.wikibase_item;
  
  if (!wikidataId) {
    console.log("No Wikidata ID found.");
    return;
  }
  
  console.log(`Wikidata ID: ${wikidataId}`);
  
  // 2. Get Platform claims (P400)
  const wdRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetclaims&entity=${wikidataId}&property=P400&format=json`);
  const wdData = await wdRes.json();
  const platformClaims = wdData.claims.P400;
  
  if (!platformClaims) {
    console.log("No Platform claims found.");
    return;
  }
  
  const platformIds = platformClaims.map((c: any) => c.mainsnak.datavalue?.value?.id).filter(Boolean);
  console.log(`Platform IDs: ${platformIds.join(', ')}`);
  
  // 3. Get labels for these platform IDs
  const labelsRes = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${platformIds.join('|')}&props=labels&languages=en&format=json`);
  const labelsData = await labelsRes.json();
  
  const platforms = platformIds.map((id: string) => labelsData.entities[id]?.labels?.en?.value);
  console.log(`Platforms: ${platforms.join(', ')}`);
}

testWikidata();
