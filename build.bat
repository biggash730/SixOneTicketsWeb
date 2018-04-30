@echo off 
echo ----- Run webpack and copy bundle files ------
webpack && xcopy build\bundle.js ..\61tikitsapi\SixOneTikitsApi\scripts /s /e /i /h /y && xcopy build\bundle.js.map ..\61tikitsapi\SixOneTikitsApi\scripts /s /e /i /h /y