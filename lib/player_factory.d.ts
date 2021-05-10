import { MessageBus } from "dbus-next";
import player from "./player";
export default class PlayerFactory {
    bus: MessageBus;
    constructor();
    getPlayerNames(): Promise<any>;
    getPlayer(playerServiceName?: any): Promise<player | undefined>;
}
//# sourceMappingURL=player_factory.d.ts.map