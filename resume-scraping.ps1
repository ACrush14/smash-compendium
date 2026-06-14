Write-Host "====================================================="
Write-Host "Retomando o scraping de troféus (SSB4)..."
Write-Host "Isso pode demorar alguns minutos devido ao rate limit."
Write-Host "====================================================="

Write-Host "`nProcessando SSB4..."
npx tsx --env-file=.env.local scripts/admin/scrape-trophy-descriptions.ts --game=SSB4

Write-Host "`n====================================================="
Write-Host "Scraping concluído com sucesso!"
Write-Host "====================================================="
