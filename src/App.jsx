import { useEffect } from 'react';
import {FancyAnsi} from "fancy-ansi";
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import 'react-tabs/style/react-tabs.css';

let current_serial_line = "";
let serial = "";
let fancyAnsi = new FancyAnsi();
let initialized = false;

function App() {
  useEffect(function initializeEmulator() {
    if (!initialized) {
      initialized = true;
      window.emulator = new window.V86({
        wasm_path: 'v86.wasm',
        screen_container: document.getElementById("screen_container"),
        boot_order: 0x213, // CD, FDD, HD
        bios: {
          url: "https://corsproxy.io/?url=https://github.com/copy/v86/raw/refs/heads/master/bios/seabios.bin"
        },
        vga_bios: {
          url: "https://corsproxy.io/?url=https://github.com/copy/v86/raw/refs/heads/master/bios/vgabios.bin"
        },
        cdrom: {
          url: "https://corsproxy.io/?url=https://github.com/hhuOS/hhuOS/releases/download/nightly-development/hhuOS-limine-vdd.iso"
        },
        memory_size: 256 * 1024 * 1024,
        acpi: true,
        autostart: true
      });

      window.emulator.add_listener("serial0-output-byte", function(byte) {
        current_serial_line += String.fromCharCode(byte);
        if (byte === 10) {
          serial += current_serial_line;
          current_serial_line = "";

          let serial_container = document.getElementById("serial_container");
          serial_container.innerHTML = fancyAnsi.toHtml(serial);
          serial_container.scrollTo({top: serial_container.scrollHeight});// Scroll to bottom
        }
      });

      window.emulator.add_listener("screen-set-size", function(size) {
        let screen_container = document.getElementById("screen_container");
        let screen_container_outer = document.getElementById("screen_container_outer");
        let width = size[0];
        let height = size[1];

        screen_container.style.width = width + "px";
        screen_container.style.height = height + "px";
        screen_container_outer.style.width = (width + 100) + "px";
        screen_container_outer.style.height = (height + 100) + "px";
      });

      window.emulator.add_listener("download-progress", function(progress) {
        let download = document.getElementById("download");
        let percentage = progress.loaded / progress.total;
        let text = "Downloading disk image " + (progress.file_index + 1) + "/" + progress.file_count + ": ";

        for (let i = 0; i < 40 * percentage; i++) {
          text += "█";
        }
        for (let i = 40 * percentage; i < 40; i++) {
          text += "░";
        }

        text += " " + Math.floor(percentage * 100) + "%";
        download.innerText = text;
      });

      window.emulator.add_listener("download-error", function() {
        let download = document.getElementById("download");
        download.innerText = "Error downloading disk image.";
      })
    }
  }, []);

  return (
      <Tabs onKeyDown={() => {}}>
        <TabList>
          <Tab>Screen</Tab>
          <Tab>Serial Output</Tab>
        </TabList>

        <TabPanel forceRender={true}>
          <center>
            <h1 id="title">hhuOS (in your web browser)</h1>
            <div id="download"></div>
            <div id="screen_container_outer" style={{borderRadius: "25px"}}>
                <div id="screen_container" style={{display: "block", borderRadius: "10px"}}>
                  <div id="screen">Initializing Emulator...</div>
                  <canvas style={{display: 'none'}}></canvas>
                </div>
            </div>
            <div id="description">
              This website runs <a href="https://github.com/hhuOS/hhuOS">hhuOS</a> in your web browser using the <a href="https://github.com/copy/v86/">V86</a> emulator (with <a href="https://www.seabios.org/">SeaBIOS</a> as the BIOS image).<br/>
              <br/>
              Use the tabs above to switch between the graphical screen output and the serial console output.<br/>
              The OS writes kernel logs to the serial console, which can be useful for debugging.<br/>
              <br/>
              Performance may vary depending on your device and browser.<br/>
              Booting may take a few seconds, because of hhuOS not liking the emulated storage devices.<br/>
              <br/>
              The OS will boot into a shell with some UNIX-like commands.<br/>
              Run <u>ls /bin</u> to see all available applications. Try out <u>bug</u> and <u>dino</u> for some old-fashioned games!
            </div>
          </center>
        </TabPanel>
        <TabPanel forceRender={true}>
          <div id="serial_container">
            All serial output will appear here...
          </div>
        </TabPanel>
      </Tabs>
  );
}

export default App
