import * as fs from "fs";
import * as path from "path";
import { RadJavTools } from "radjav-tools-lib";

interface Command
{
	cmd: string[];
	desc: string
	help: string;
	evt: Function;
}

var packageStr = fs.readFileSync (path.normalize (__dirname + "/../package.json")).toString ();
var packageJSON = JSON.parse (packageStr);

var helpHeader: string = `RadJav Tools - v${packageJSON.version}\n`;
helpHeader += "Copyright(c) 2019, FogChain, Corp.\n";
helpHeader += "Under the MIT License\n\n";

function getCommand (cmdList: Command[], cmdName: string): Command
{
	let foundCmd: Command = null;

	cmdList.forEach (function (val, index)
					{
						let cmd = val.cmd[0];

						if (cmd == cmdName)
							foundCmd = val;
					});

	return (foundCmd);
}

var commands: Command[] = [
	{
		cmd: ["http", "h"],
		desc: "Start a HTTP to test the HTML5 app.",
		help: "",
		evt: function (args: string[])
			{
				let hostFolder = process.cwd ();
				let port = 3453;
				let listenAddr = "127.0.0.1";

				if (args.length > 0)
					hostFolder = path.normalize (args[0]);

				if (args.length > 1)
					port = parseInt (args[1]);

				if (args.length > 2)
					listenAddr = args[2];

				RadJavTools.startHTTP (hostFolder, port, listenAddr).then (function (conn)
					{
						console.log (`Hosting RadJav App at http://${conn.listenAddr}:${conn.port}`);
					});
			}
	}, 
	{
		cmd: ["createProject", "p"],
		desc: "Create a project.",
		help: "",
		evt: function (args: string[])
			{
				let appFolder = path.normalize (args[0]);
				let radJavBuildDir = path.normalize (__dirname + "/../resources/RadJav");
				let dependenciesDir = path.normalize (__dirname + "/../resources/dependencies");
				let examplesDir = path.normalize (__dirname + "/../../../examples");

				if (fs.existsSync (examplesDir) == true)
				{
					radJavBuildDir = path.normalize (__dirname + "/../../../html5/build");
					dependenciesDir = path.normalize (__dirname + "/../../../html5/dependencies");
				}
				else
					examplesDir = path.normalize (__dirname + "/../resources/examples");

				if (args.length > 1)
					radJavBuildDir = path.normalize (args[1]);

				if (args.length > 2)
					dependenciesDir = path.normalize (args[2]);
	
				if (args.length > 3)
					examplesDir = path.normalize (args[3]);

				RadJavTools.createProject (appFolder, radJavBuildDir, 
					dependenciesDir, examplesDir, 
					path.normalize (__dirname + "/../resources/RadJavApp.htm"));
			}
	},
	{
		cmd: ["buildIPA", "i"],
		desc: "Build an iOS IPA from a selected folder.",
		help: "",
		evt: function (args: string[])
			{
				let appFolder: string = path.normalize (args[0]);
				let customFileName: string = "app.xrj";
				let binPath: string = "./";

				if (args.length > 1)
					customFileName = args[1];

				if (args.length > 2)
					binPath = args[2];

				RadJavTools.buildIPA (binPath, appFolder, customFileName);
			}
	},
	{
		cmd: ["buildAPK", "a"],
		desc: "Build an Android APK from a selected folder.",
		help: "",
		evt: function (args: string[])
			{
				let appFolder: string = path.normalize (args[0]);
				let androidsdk: string = "";
				let customFileName: string = "app.xrj";
				let binPath: string = "./";
				let jarSignerPath: string = "";

				if (args.length > 1)
					customFileName = args[1];

				if (args.length > 2)
					androidsdk = args[2];

				if (args.length > 3)
					jarSignerPath = args[3];

				if (args.length > 4)
					binPath = args[4];

				RadJavTools.buildAPK (binPath, appFolder, customFileName, androidsdk, jarSignerPath);
			}
	},
	{
		cmd: ["convertFormDesignerToJSON", "c"],
		desc: "Convert Visual Studio's form designer output to RadJav's GUI JSON. Can either be a .cs or .vb file.",
		help: "",
		evt: function (args: string[])
			{
				let file: string = "";
				let outputFile: string = "";
				let content: string = "";

				if (args[0] != null)
					file = args[0];

				if (args[1] != null)
					outputFile = args[1];

				content = fs.readFileSync (file).toString ();
				let json: string = RadJavTools.convertToGUIJSON (content, file);

				fs.writeFileSync (outputFile, json);
			}
	},
	{
		cmd: ["help", "h"],
		desc: "Help",
		help: "",
		evt: function (args: string[])
			{
				let str = helpHeader;

				commands.forEach (function (val, index)
					{
						let line = "  ";
						let spaces = "";
						let maxSpaces = 4;

						for (let iIdx = 0; iIdx < val.cmd.length; iIdx++)
						{
							let cmd = val.cmd[iIdx];

							if (iIdx == 0)
								line += "--" + cmd;

							if (iIdx == 1)
								line += ", -" + cmd;
						}

						if (index == 2)
							maxSpaces--;

						for (let iIdx = 0; iIdx < maxSpaces; iIdx++)
							spaces += " ";

						line += spaces + val.desc;
						str += line + "\n";
					});

				console.log (str);
			}
	}
	];

var execFunc: Function = null;
let args: any[] = [];

process.argv.forEach (function (val: string, index: number)
		{
			if (index == 2)
			{
				commands.forEach (function (val2: Command, index2: number)
					{
						for (let iIdx = 0; iIdx < val2.cmd.length; iIdx++)
						{
							let cmd = val2.cmd[iIdx];

							if (iIdx == 0)
								cmd = "--" + cmd;

							if (val == cmd)
								execFunc = val2.evt;
						}
					});
			}

			if (index > 2)
				args.push (val);
		});

if (execFunc != null)
	execFunc (args);
else
{
	let helpCmd: Command = getCommand (commands, "help");
	helpCmd.evt ();
}