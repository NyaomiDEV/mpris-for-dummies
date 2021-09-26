import { Variant } from "dbus-next";

export function marshallVariants(object: any): any{
	if(object instanceof Variant)
		return marshallVariants(object.value);

	if(typeof object === "object" && object !== null){
		for(let i in object)
			object[i] = marshallVariants(object[i]);
	}

	return object;
}

