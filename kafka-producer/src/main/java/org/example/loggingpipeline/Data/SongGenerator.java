package org.example.loggingpipeline.Data;

import java.util.Random;

public class SongGenerator {
    private static final String[] ARTISTS = {
            "Sia", "Ed Sheeran", "Taylor Swift", "Dua Lipa", "Ellie Goulding",
            "Adele", "Michael Jackson", "Tupac", "Imagine Dragons", "Billie Eilish"
    };

    private static final String[] SONG_TITLES = {
            "Chandelier", "Shape of You", "Bohemian Rhapsody", "Hello",
            "Uptown Funk", "Fix You", "Radioactive", "Bad Guy", "Yesterday",
            "Someone Like You", "Thunderstruck", "Hotel California", "Stairway to Heaven"
    };

    private static final String[] GENRES = {
            "Pop", "Rock", "Alternative", "Electronic", "Jazz", "Classical", "Hip-Hop", "Country"
    };

    private static final String[] ALBUMS = {
            "1000 Forms of Fear", "÷ (Divide)", "A Night at the Opera",
            "21", "Uptown Special", "X&Y", "Night Visions", "When We All Fall Asleep"
    };

    private final Random random = new Random();

    public Song generateRandomSong() {
        String artist = ARTISTS[random.nextInt(ARTISTS.length)];
        String title = SONG_TITLES[random.nextInt(SONG_TITLES.length)];
        String album = ALBUMS[random.nextInt(ALBUMS.length)];
        String genre = GENRES[random.nextInt(GENRES.length)];
        int duration = 120 + random.nextInt(300); // 2-7 minutes

        return new Song(title, artist, album, duration, genre);
    }
}