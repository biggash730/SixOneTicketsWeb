@echo off 
echo ----- Run webpack and copy bundle files ------
webpack && xcopy build\bundle.js ..\corrupack-api\corrupack\scripts /s /e /i /h /y