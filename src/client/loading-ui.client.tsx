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

class LoadingBar extends Roact.Component<LoadingBarState> {
    running = false;
    loadingbarref: Roact.Ref<Frame>

    state = {
        AssetsLoaded: 0
    }

    constructor(props: any) {
        super(props);
        this.loadingbarref = Roact.createRef<Frame>();
    }

    render() {
        return (
            <frame
                Key="LoadingBarContainer"

                Size={new UDim2(0.75, 0, 0.05, 0)}
                Position={new UDim2(0.5, 0, 0.5, 0)}
                AnchorPoint={new Vector2(0.5, 0.5)}
                
                BackgroundTransparency={0.5}>

                    <frame
                        Key="LoadingBar"
                        Ref={this.loadingbarref}

                        Size={new UDim2(AssetsLoaded/AssetsToLoad.size(), 0, 1, 0)}
                        Position={new UDim2(0.5, 0, 0.5, 0)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                        BorderSizePixel={0}/>
            </frame>
        )
    }

    didMount() {
        const LoadingBar = this.loadingbarref.getValue() as Frame;

        spawn(() => {
            while (this.state.AssetsLoaded !== AssetsToLoad.size()) {
                RunService.Stepped.Wait();

                this.setState({
                    AssetsLoaded: AssetsLoaded
                });
            }

            TweenService.Create(LoadingBar, new TweenInfo(1, Enum.EasingStyle.Sine), {BackgroundColor3: Color3.fromRGB(0, 255, 0)}).Play();
        })
    }
}

const LoadingUI = <screengui
    IgnoreGuiInset={true}
    ResetOnSpawn={false}
    
    DisplayOrder={10}>

        <frame
            Key="Background"

            Size={new UDim2(1, 0, 1, 0)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            AnchorPoint={new Vector2(0.5, 0.5)}

            BackgroundColor3={Color3.fromRGB(0, 0, 0)}>
                
                <LoadingBar/>
        </frame>
</screengui>

const UITree = Roact.mount(LoadingUI, PlayerGui, "LoadingUI")

while (AssetsLoaded !== AssetsToLoad.size()) {
    RunService.Stepped.Wait();
    print(`${AssetsLoaded}/${AssetsToLoad.size()}`)
}

task.wait(1);

Roact.unmount(UITree)

print("Completed!")