/**
 * Jamendo API Test Script
 * Run with: node --loader ts-node/esm test-jamendo.ts
 * Or add to package.json: "test:jamendo": "tsx test-jamendo.ts"
 */

import {
  searchTracks,
  browseByGenre,
  smartSearch,
  getCuratedPlaylist,
  getPopularTracks,
  isJamendoConfigured,
  getUsageStats,
  formatDuration,
  type JamendoGenreCategory
} from './services/jamendoService';

async function testJamendoAPI() {
  console.log('🎵 Jamendo API Test Suite\n');
  console.log('='.repeat(60));

  // Test 1: Check configuration
  console.log('\n📋 Test 1: Configuration Check');
  console.log('-'.repeat(60));

  const isConfigured = isJamendoConfigured();
  console.log(`✓ API Configured: ${isConfigured ? '✅ YES' : '❌ NO'}`);

  if (!isConfigured) {
    console.error('\n❌ ERROR: Jamendo API not configured!');
    console.log('\nPlease follow these steps:');
    console.log('1. Visit https://developer.jamendo.com/');
    console.log('2. Create a free account and get your Client ID');
    console.log('3. Add to .env.local: VITE_JAMENDO_CLIENT_ID=your_client_id_here');
    console.log('4. Restart this test\n');
    process.exit(1);
  }

  // Test 2: Usage stats
  console.log('\n📊 Test 2: Usage Statistics');
  console.log('-'.repeat(60));

  const stats = getUsageStats();
  console.log(`✓ Requests this month: ${stats.requestsThisMonth} / ${stats.monthlyLimit}`);
  console.log(`✓ Remaining requests: ${stats.remainingRequests}`);
  console.log(`✓ Reset date: ${stats.resetDate.toLocaleDateString()}`);

  try {
    // Test 3: Search tracks
    console.log('\n🔍 Test 3: Search Tracks');
    console.log('-'.repeat(60));

    console.log('Searching for "piano"...');
    const searchResults = await searchTracks('piano', { limit: 5 });

    console.log(`✓ Found ${searchResults.results.length} tracks`);
    if (searchResults.results.length > 0) {
      const firstTrack = searchResults.results[0];
      console.log(`\n  Example track:`);
      console.log(`  - Title: ${firstTrack.name}`);
      console.log(`  - Artist: ${firstTrack.artist_name}`);
      console.log(`  - Album: ${firstTrack.album_name}`);
      console.log(`  - Duration: ${formatDuration(firstTrack.duration)}`);
      console.log(`  - Released: ${firstTrack.releasedate}`);
      console.log(`  - Download: ${firstTrack.audiodownload_allowed ? 'Yes' : 'No'}`);
    }

    // Test 4: Browse by genre
    console.log('\n🎼 Test 4: Browse by Genre');
    console.log('-'.repeat(60));

    const genres: JamendoGenreCategory[] = ['anime', 'edm', 'lofi', 'classical'];

    for (const genre of genres) {
      console.log(`\nBrowsing "${genre}" genre...`);
      const genreResults = await browseByGenre(genre, 3);
      console.log(`✓ Found ${genreResults.results.length} tracks`);

      if (genreResults.results.length > 0) {
        genreResults.results.forEach((track, i) => {
          console.log(`  ${i + 1}. ${track.name} - ${track.artist_name} (${formatDuration(track.duration)})`);
        });
      }
    }

    // Test 5: Smart search
    console.log('\n🧠 Test 5: Smart Search (Keyword Mapping)');
    console.log('-'.repeat(60));

    const smartQueries = ['calm music', 'study beats', 'anime soundtrack'];

    for (const query of smartQueries) {
      console.log(`\nSmart searching for "${query}"...`);
      const smartResults = await smartSearch(query, 2);
      console.log(`✓ Found ${smartResults.results.length} tracks`);

      if (smartResults.results.length > 0) {
        smartResults.results.forEach((track, i) => {
          console.log(`  ${i + 1}. ${track.name} - ${track.artist_name}`);
        });
      }
    }

    // Test 6: Curated playlists
    console.log('\n🎯 Test 6: Curated Playlists for Activities');
    console.log('-'.repeat(60));

    const activities: Array<'homework' | 'break' | 'focus'> = ['homework', 'break', 'focus'];

    for (const activity of activities) {
      console.log(`\nGetting curated playlist for "${activity}"...`);
      const playlistResults = await getCuratedPlaylist(activity, 3);
      console.log(`✓ Found ${playlistResults.results.length} tracks`);

      if (playlistResults.results.length > 0) {
        playlistResults.results.forEach((track, i) => {
          console.log(`  ${i + 1}. ${track.name} - ${track.artist_name}`);
        });
      }
    }

    // Test 7: Popular tracks
    console.log('\n🔥 Test 7: Popular Tracks');
    console.log('-'.repeat(60));

    console.log('Getting trending tracks...');
    const popularResults = await getPopularTracks(5);
    console.log(`✓ Found ${popularResults.results.length} tracks`);

    if (popularResults.results.length > 0) {
      popularResults.results.forEach((track, i) => {
        console.log(`  ${i + 1}. ${track.name} - ${track.artist_name} (${formatDuration(track.duration)})`);
      });
    }

    // Final summary
    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests passed!');
    console.log('='.repeat(60));

    const finalStats = getUsageStats();
    console.log(`\n📊 Final Usage: ${finalStats.requestsThisMonth} / ${finalStats.monthlyLimit} requests`);
    console.log(`   Remaining: ${finalStats.remainingRequests}\n`);

  } catch (error: any) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nError details:', error);
    process.exit(1);
  }
}

// Run tests
testJamendoAPI();
