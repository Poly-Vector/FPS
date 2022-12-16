import { Players, RunService, TweenService } from "@rbxts/services";
import Roact from "@rbxts/roact";

const PlayerGui = Players.LocalPlayer.WaitForChild("PlayerGui") as PlayerGui;

const TweenProperties = new TweenInfo(
    0.25,
    Enum.EasingStyle.Sine
);

interface UIProps {
    key: string,
    text: string,

    size: UDim2,
    position: UDim2,
}

class Button extends Roact.Component<UIProps> {
    textlabel: Roact.Ref<TextLabel>
    textbuttonframe: Roact.Ref<Frame>

    constructor(props: any) {
        super(props);

        this.textlabel = Roact.createRef<TextLabel>();
        this.textbuttonframe = Roact.createRef<Frame>();
    }

    render() {
        return (
            <textbutton
                Key={this.props.key}
                Text=""
                
                Size={this.props.size}
                Position={this.props.position}
                AnchorPoint={new Vector2(0.5, 0.5)}
                
                BackgroundColor3={Color3.fromRGB(0, 0, 0)}
                BorderSizePixel={2}
                BorderColor3={Color3.fromRGB(255, 255, 255)}>

                    <frame
                        Key="TextButtonFrame"
                        Ref={this.textbuttonframe}
                        
                        Size={new UDim2(0, 0, 1, 0)}
                        Position={new UDim2(0, 0, 0, 0)}
                        Transparency={1}
                        
                        BackgroundColor3={Color3.fromRGB(255, 255, 255)}/>

                    <textlabel
                        Key={this.props.key}
                        Ref={this.textlabel}
                        Text={this.props.text.upper()}

                        Font={Enum.Font.GothamBlack}
                        TextColor3={Color3.fromRGB(255, 255, 255)}
                        TextSize={12}

                        Size={new UDim2(1, 0, 1, 0)}
                        Position={new UDim2(0.5, 0, 0.5, 0)}
                        AnchorPoint={new Vector2(0.5, 0.5)}
                        ZIndex={5}

                        BackgroundTransparency={1}
                                
                        Event={{
                            MouseEnter: () => {
                                (this.textlabel.getValue() as TextLabel).TextColor3 = Color3.fromRGB(0, 0, 0);

                                TweenService.Create((this.textbuttonframe.getValue() as Frame), TweenProperties, {
                                    Size: new UDim2(1, 0, 1, 0),
                                    Transparency: 0
                                }).Play();
                            },

                            MouseLeave: () => {
                                (this.textlabel.getValue() as TextLabel).TextColor3 = Color3.fromRGB(255, 255, 255);
                                
                                TweenService.Create((this.textbuttonframe.getValue() as Frame), TweenProperties, {
                                    Size: new UDim2(0, 0, 1, 0),
                                    Transparency: 1
                                }).Play();
                            }
                        }}/>

            </textbutton>
        )
    }
}

class Label extends Roact.Component<UIProps> {
    render() {
        return (
            <textlabel
                Key={this.props.key}
                Text={this.props.text.upper()}

                Font={Enum.Font.GothamBlack}
                TextColor3={Color3.fromRGB(255, 255, 255)}
                TextSize={12}

                Size={this.props.size}
                Position={this.props.position}
                AnchorPoint={new Vector2(0.5, 0.5)}
                ZIndex={5}

                BorderSizePixel={2}
                BorderColor3={Color3.fromRGB(255, 255, 255)}

                BackgroundColor3 = {Color3.fromRGB(0, 0, 0)}/>
        )
    }
}

const MenuUI = <screengui>
    <Button
        key="Deploy"
        text="Deploy"
        size={new UDim2(0.15, 0, 0.05, 0)}
        position={new UDim2(0.915, 0, 0.95, 0)}/>
</screengui>


while (PlayerGui.FindFirstChild("LoadingUI") !== undefined) {
    RunService.Stepped.Wait();
}

Roact.mount(MenuUI, PlayerGui, "MenuUI");