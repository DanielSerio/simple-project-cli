@echo off
set first="%~1"
set sec="%~2"
set third="%~3"
set fourth="%~4"

node "%~dp0\dist" %first% %sec% %third% %fourth%