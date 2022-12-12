import { Players } from "@rbxts/services";
import { ContentProvider } from "@rbxts/services";
import Roact from "@rbxts/roact";

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

ContentProvider.PreloadAsync(game.GetDescendants())
const LoadAmount = (game.GetDescendants().size())

interface UIProps {
    text: string
}

interface UIState {
    AmountLoaded: number
}

class LoadingBar extends Roact.Component<UIProps, UIState> {
    running = false

    state = {
        AmountLoaded: 0
    }

    render() {
        return (
            <frame
            Key="LoadingBarContainer"
            
            Size={new UDim2(0.75, 0, 0.05, 0)}
            Position={new UDim2(0.5, 0, 0.5, 0)}
            AnchorPoint={new Vector2(0.5, 0.5)}
            
            BackgroundTransparency={0.5}
            >
                <frame
                    Key="LoadingBar"

                    Size={new UDim2(this.state.AmountLoaded/LoadAmount, 0, 1, 0)}
                    Position={new UDim2(0.5, 0, 0.5, 0)}
                    AnchorPoint={new Vector2(0.5, 0.5)}
                    
                    BackgroundColor3={Color3.fromRGB(255, 255, 255)}
                    Event={{
                        
                    }}/>
            </frame>
        )
    }

    didMount() {
        this.running = true

        spawn(() => {
            while (this.running = true) {
                this.setState(state => {
                    return {
                        AmountLoaded: ContentProvider.RequestQueueSize
                    }
                })
            }
        })
    }
}

const LoadingUI = <screengui
    IgnoreGuiInset={true}>
    <frame
        Key="Background"

        Size={new UDim2(1, 0, 1, 0)}
        Position={new UDim2(0.5, 0, 0.5, 0)}
        AnchorPoint={new Vector2(0.5, 0.5)}

        BackgroundColor3={Color3.fromRGB(0, 0, 0)}>
    </frame>
</screengui>

const UITree = Roact.mount(LoadingUI, PlayerGui, "LoadingUI")