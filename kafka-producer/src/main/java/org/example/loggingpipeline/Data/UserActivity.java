package org.example.loggingpipeline.Data;

import java.time.Instant;
import java.util.Random;

public class UserActivity {
    private String userId;
    private String action;
    private String sessionId;
    private Song song;
    private long timestamp;

    public UserActivity() {
        this.timestamp = Instant.now().toEpochMilli();
        this.action = new String[]{"playing", "paused", "stopped"}[new Random().nextInt(3)];
    }

    public UserActivity(String userId, Song song, String sessionId) {
        this();
        this.userId = userId;
        this.sessionId = sessionId;
        this.song = song;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Song getSong() {
        return song;
    }

    public void setSong(Song song) {
        this.song = song;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "{" +
                "userId='" + userId + '\'' +
                ", action='" + action + '\'' +
                ", sessionId='" + sessionId + '\'' +
                ", timestamp=" + timestamp +
                "}";
    }
}
