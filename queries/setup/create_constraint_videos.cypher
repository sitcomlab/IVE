// Unique Video Id
CREATE CONSTRAINT ON (video:Videos) ASSERT video.video_uuid IS UNIQUE;
