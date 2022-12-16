import { Players, ContentProvider, RunService, TweenService } from "@rbxts/services";
import Roact from "@rbxts/roact";

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

let AssetsLoaded = 0
let AssetsToLoad = game.GetDescendants()

spawn(() => {
    AssetsToLoad = game.GetDescendants()

    game.GetDescendants().forEach(Asset => {
        ContentProvider.PreloadAsync([Asset]);

        AssetsLoaded += 1;
    })
})

interface LoadingBarState {
    AssetsLoaded: number
}

class LoadingScreen extends Roact.Component<LoadingBarState> {
    running = false;

    loadingbarcontainer: Roact.Ref<Frame>;
    loadingbar: Roact.Ref<Frame>;
    assetsindicator: Roact.Ref<TextLabel>;

    state = {
        AssetsLoaded: 0
    }

    constructor(props: any) {
        super(props);

        this.loadingbarcontainer = Roact.createRef<Frame>();
        this.loadingbar = Roact.createRef<Frame>();
        this.assetsindicator = Roact.createRef<TextLabel>();
    }

    render() {
        return (
            <screengui
                IgnoreGuiInset={true}
                ResetOnSpawn={false}

                DisplayOrder={10}>

                <frame
                    Key="Background"

                    Size={new UDim2(1, 0, 1, 0)}
                    Position={new UDim2(0.5, 0, 0.5, 0)}
                    AnchorPoint={new Vector2(0.5, 0.5)}

                    BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                    BorderSizePixel={0}>

                        <textlabel
                            Key="AssetsIndicator"
                            Ref={this.assetsindicator}

                            Text={`${this.state.AssetsLoaded}/${AssetsToLoad.size()}`}

                            Font={Enum.Font.GothamBlack}
                            TextColor3={Color3.fromRGB(255, 255, 255)}
                            TextSize={24}

                            Size={new UDim2(0.15, 0, 0.05, 0)}
                            Position={new UDim2(0.5, 0, 0.575, 0)}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            
                            BackgroundTransparency={1}/>

                        <frame
                            Key="LoadingBarContainer"
                            Ref={this.loadingbarcontainer}

                            Size={new UDim2(0.75, 0, 0.05, 0)}
                            Position={new UDim2(0.5, 0, 0.5, 0)}
                            AnchorPoint={new Vector2(0.5, 0.5)}
                            
                            BackgroundTransparency={0.5}
                            BorderSizePixel={0}>

                                <frame
                                    Key="LoadingBar"
                                    Ref={this.loadingbar}

                                    Size={new UDim2(this.state.AssetsLoaded/AssetsToLoad.size(), 0, 1, 0)}
                                    Position={new UDim2(0.5, 0, 0.5, 0)}
                                    AnchorPoint={new Vector2(0.5, 0.5)}
                                    
                                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                                    BorderSizePixel={0}/>
                        </frame>
                </frame>
            </screengui>
        )
    }

    didMount() {
        const LoadingBarContainer = this.loadingbarcontainer.getValue() as Frame;
        const LoadingBar = this.loadingbar.getValue() as Frame;
        const AssetsIndicator = this.assetsindicator.getValue() as TextLabel;

        spawn(() => {
            while (this.state.AssetsLoaded !== AssetsToLoad.size()) {
                RunService.Stepped.Wait();

                this.setState({
                    AssetsLoaded: AssetsLoaded
                });
            }

            TweenService.Create(LoadingBarContainer, new TweenInfo(1, Enum.EasingStyle.Sine), {Transparency: 1}).Play();
            TweenService.Create(LoadingBar, new TweenInfo(1, Enum.EasingStyle.Sine), {Transparency: 1}).Play();

            TweenService.Create(AssetsIndicator, new TweenInfo(1, Enum.EasingStyle.Sine), {TextTransparency: 1}).Play();
        })
    }
}

const UITree = Roact.mount(<LoadingScreen/>, PlayerGui, "LoadingUI")

while (AssetsLoaded !== AssetsToLoad.size()) {
    RunService.Stepped.Wait();
    print(`${AssetsLoaded}/${AssetsToLoad.size()}`)
}

task.wait(1);

Roact.unmount(UITree)

print("Completed!")