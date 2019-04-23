# RadJav Tools
This repo is a collection of tools for developing with RadJav.

This can be installed by opening a terminal and entering:

	npm -g install radjav-tools

# Creating a project
Simply specify a path to the new RadJav project you'd like to create.

	radjav-tools --createProject NEW_PATH_TO_PROJECT

# Testing an HTML5 project
Run the HTTP server which will host the HTML5 version of your app.

Open a terminal, navigate to your app directory, and enter:

	radjav-tools --http

# Build an IPA for iOS
Once you've created your RadJav app, you can build an IPA that can be installed to an iOS device.

	radjav-tools --buildIPA PATH_TO_RADJAV_APP

# Build an APK for Android
Once you've created your RadJav app, you can build an APK that can be installed to an Android device.

	radjav-tools --buildAPK PATH_TO_RADJAV_APP

# Convert C# and VB.Net to RadJav GUI JSON file
Convert a C# .Net or VB.Net form designer file to a RadJav GUI JSON file that can be easily be read by nearly anything!

	radjav-tools --convertFormDesignerToJSON Form_designer_file_path Output_JSON_file_path

# Installing IPAs
imobiledevice must be installed in order to install an IPA on either Windows, Mac, or Linux.

## Installing imobiledevice on Windows
http://docs.quamotion.mobi/imobiledevice/download/

## Installing imobiledevice on Ubuntu
sudo apt-get install libimobiledevice
sudo apt-get install ideviceinstaller

## Installing imobiledevice on Mac
brew install libimobiledevice
brew install ideviceinstaller