const sampleDef = [
  ["Q", "Heater-1", ["Heater-2", "Heater-3", "Melody-1", "Chord-1", "Beat-1", "Beat-3"]],
  ["W", "Heater-2", ["Heater-1", "Heater-3", "Melody-2", "Chord-2", "Beat-2", "Beat-4"]],
  ["E", "Heater-3", ["Heater-1", "Heater-2", "Sample-1", "Sample-2", "Sample-3", "Sample-4"]],
  ["A", "Melody-1", ["Heater-1", "Melody-2", "Sample-1", "Chord-1", "Beat-1", "Beat-3"]],
  ["S", "Melody-2", ["Melody-1", "Heater-2", "Sample-1", "Chord-2", "Beat-2", "Beat-4"]],
  ["D", "Sample-1", ["Melody-1", "Melody-2", "Heater-3", "Sample-2", "Sample-3", "Sample-4"]],
  ["Z", "Chord-1", ["Heater-1", "Melody-1", "Chord-2", "Sample-2", "Beat-1", "Beat-3"]],
  ["X", "Chord-2", ["Heater-2", "Melody-2", "Chord-1", "Sample-2", "Beat-2", "Beat-4"]],
  ["C", "Sample-2", ["Heater-3", "Sample-1", "Chord-1", "Chord-2", "Sample-3", "Sample-4"]],
  ["1", "Beat-1", ["Heater-1", "Melody-1", "Chord-1", "Beat-3", "Beat-2", "Sample-3"]],
  ["2", "Beat-2", ["Heater-2", "Melody-2", "Chord-2", "Beat-4", "Beat-1", "Sample-3"]],
  ["3", "Sample-3", ["Heater-3", "Sample-1", "Sample-2", "Beat-1", "Beat-2", "Sample-4"]],
  ["R", "Beat-3", ["Heater-1", "Melody-1", "Chord-1", "Beat-1", "Beat-4", "Sample-4"]],
  ["F", "Beat-4", ["Heater-2", "Melody-2", "Chord-2", "Beat-3", "Beat-2", "Sample-4"]],
  ["V", "Sample-4", ["Heater-3", "Sample-1", "Sample-2", "Sample-3", "Beat-3", "Beat-4"]]
];

const colors = ['#e52862', '#1067ff', '#a21ba4', '#e29f1b', '#39af15', '#bbbb00'];
////////////////////////////////////////////////////////////////

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      display: '---^._.^---',
      volume: "0.5",
      size: 15,
      keys: false,
      showPopup: false,
      bank: "A"
    };
    this.handleVolume = this.handleVolume.bind(this);
    this.handleAudioClick = this.handleAudioClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.playSound = this.playSound.bind(this);
    this.flashButtons = this.flashButtons.bind(this);
    this.turnOffButtons = this.turnOffButtons.bind(this);
    this.isTouchEnabled = this.isTouchEnabled.bind(this);
    this.handleSize = this.handleSize.bind(this);
    this.handleKeys = this.handleKeys.bind(this);
    this.handleBank = this.handleBank.bind(this);
    this.handleEventListener = this.handleEventListener.bind(this);
    this.togglePopup = this.togglePopup.bind(this);
    // this.locOrientation = this.locOrientation.bind(this);
  }

  // locOrientation = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation || screen.orientation.lock;
  
  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown.bind(this));
    const audios = document.querySelectorAll(".clip");
    audios.forEach(el => el.addEventListener("ended", this.handleEventListener));
    // this.locOrientation('portrait')
    //  .then( () => {console.log('locked');})
    //  .catch ( error => {console.log(`Locking error: ${error}`);});
    if (this.isTouchEnabled()) this.setState({showPopup: true});
  }

  
  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown.bind(this));
    const audios = document.querySelectorAll(".clip");
    audios.forEach(el => el.removeEventListener("ended", this.handleEventListener));
  }
  
  handleEventListener(e) {
    let audio = document.getElementById(e.target.id);
    audio = document.getElementById(audio.parentNode.id);
    const random = Math.floor(Math.random() * (6));
    ReactDOM.findDOMNode(audio).style.border = "1px solid " + colors[random];
    ReactDOM.findDOMNode(audio).style.backgroundColor = colors[random];
    ReactDOM.findDOMNode(audio).style.filter = "hue-rotate(0deg) contrast(90%) brightness(90%)";
    this.setState({
      display: '---^._.^---'
    });
    
  }
  
  handleVolume(e) {
    this.setState({
      volume: e.target.value
    });
    const audios = document.querySelectorAll(".clip");
    audios.forEach(el => el.volume = this.state.volume);
  }

  isTouchEnabled() {
    return (
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    );
  }

  playSound(audio) {
    if (ReactDOM.findDOMNode(audio).duration > 0) {
      ReactDOM.findDOMNode(audio).pause();
      ReactDOM.findDOMNode(audio).currentTime = 0;
      ReactDOM.findDOMNode(audio).play();
      audio = document.getElementById(audio.parentNode.id);
      ReactDOM.findDOMNode(audio).style.filter = "contrast(150%) brightness(150%) hue-rotate(-90deg)";
    }
  }

  flashButtons(i) {
    const buttons = sampleDef[i][2];
    buttons.forEach(el => {
      let button = document.getElementById(el);
      ReactDOM.findDOMNode(button).style.filter = "contrast(100%) brightness(100%) hue-rotate(-90deg)";
    });
    setTimeout(this.turnOffButtons, 250, buttons);
  }  
  
  turnOffButtons(buttons) {
    buttons.forEach(el => {
      let button = document.getElementById(el);
      ReactDOM.findDOMNode(button).style.filter = "contrast(90%) brightness(90%) hue-rotate(0deg)";
    });
    }  
  
  handleKeyDown(e) {
    try {
      const id = e.code.slice(-1);      
      const audio = document.getElementById(id);
      this.playSound(audio);
      this.flashButtons(e.target.dataset.i);
      this.setState({
        display: audio.parentNode.id
      });
    } catch {}
  }

  handleAudioClick(e) {
    const id = e.target.id;
    const audio = document.getElementById(id).querySelector("audio");
    if (this.isTouchEnabled() && e.type === "click") return;
    this.playSound(audio);
    this.flashButtons(e.target.dataset.i);
    this.setState({
      display: id
    });
  }

  handleSize(e) {
    let size = e.target.value; 
    this.setState({
      size
    }); 
  }
  
  handleBank(e) {
    let bank = e.target.value; 
    this.setState({
      bank
    }); 
  }

  handleKeys() {
    let keys = !this.state.keys;
    this.setState({ keys });
  }

 togglePopup() {
    this.setState({
      showPopup: false
    });
  }
  
  render() {
    return (
      <div id="drum-machine">
        <Drumpad
          handleAudioClick={this.handleAudioClick}
          size={this.state.size}
          keys={this.state.keys}
          bank={this.state.bank}
        />
        <div id="container">
          <Display display={this.state.display} />
          <Volume volume={this.state.volume} handleVolume={this.handleVolume} />
          <div id="size-keys">
            <Size handleSize={this.handleSize} size={this.state.size}/>
            <Keys handleKeys={this.handleKeys} keys={this.state.keys} />
          </div>
           <Bank bank={this.state.bank} handleBank={this.handleBank} />
        </div>
        {this.state.showPopup ? 
          <Popup
            text='Rotate Your device to toggle full screen mode'
            closePopup={this.togglePopup}
          />
          : null
        }
      </div>
    );
  }
}

const Drumpad = (props) => {
  const windowSize = useWindowSize();
  let w3 = windowSize.width/3;
  let h5 = windowSize.height/5;
  let wh = Math.min(w3, h5);
  let rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
  let gtr = '1fr 1fr 1fr 1fr 1fr';
  let height = wh * 5;
  if (props.size < 15) {
    gtr = '1fr 1fr 1fr 1fr';
    height = wh * 4;    
  }
  if (props.size < 12) {
    gtr = '1fr 1fr 1fr';
    height = wh * 3;      
  }
  const styleGrid = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridTemplateRows: gtr,
    width: wh * 3,
    height: height - rem,
    gridGap: '.3rem'
  }
  
 let display = "block";
 const url = "https://raff1010x.github.io/"

 const pad = sampleDef.map((el, i, arr) => {
 if (props.size > 0) display = (i < props.size) ? "block" : "none";
 if (props.size == 0 && i > 8) return "";
   return (
     <Button
       url= {"https://raff1010x.github.io/" + props.bank + (i + 1) + ".webm"}
       id={arr[i][1]}
       keyValue={arr[i][0]}
       i={i}
       handleAudioClick={props.handleAudioClick}
       keys={props.keys}
       display={display}
       />
   );
  });

  return <div id="drum-pad" style={styleGrid}>{pad}</div>;
};

const Button = (props) => {
  const keyValue = props.keys ? props.keyValue : "";
  return (
    <div
      id={props.id}
      className="drum-pad"
      data-i={props.i}
      onClick={props.handleAudioClick}
      onTouchStart={props.handleAudioClick}
      style={{ display: props.display }}
    >
      <p>{keyValue}</p>
      <audio
        preload="auto"
        src={props.url}
        id={props.keyValue}
        className="clip"
      />
    </div>
  );
};

const Display = (props) => {
  return <div id="display">{props.display}</div>;
};

const Volume = (props) => {
  return (
    <div id="volume">
      <label id="rangeLabel" for="range">VOLUME&nbsp;&nbsp;</label>
        <input
          id="range"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={props.volume}
          onChange={props.handleVolume}
        />
    </div>
  );
};

const Size = (props) => {
  return (
    <div id="sizes">
      <label for="size-select">SIZE
        <select name="size" id="size-select" onChange={props.handleSize} value={props.size}>
          <option value="0">test</option>
          <option value="9">3x3</option>
          <option value="12">3x4</option>
          <option value="15">3x5</option>
        </select>
      </label>
    </div>
  );
};

const Keys = (props) => {
  return (
    <div id="keys">
    <label id="checkboxLabel" for="checkbox">KEYS
      <input
        id="checkbox"
        type="checkbox"
        checked={props.keys}
        onChange={props.handleKeys}
      />
      <span></span>
    </label>
    </div>
  );
};


const Bank = (props) => {
  return (
    <div id="bank">
      <label for="bank-select">BANK
        <select name="bank" id="bank-select" onChange={props.handleBank} value={props.bank}>
          <option value="A">1. Electo band</option>
          <option value="B">2. Empty space</option>
        </select>
      </label>
    </div>
  );
};


function useWindowSize() {
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined,
  });
  React.useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return windowSize;
}

class Popup extends React.Component {
  render() {
    return (
      <div className='popup'>
        <div className='popup_inner'>
          <h1>{this.props.text}</h1>
        <div onClick={this.props.closePopup}>X</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
