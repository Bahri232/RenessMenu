import { MenuOperations } from "./MenuOperations";
import Link from "next/link";
import { type Menus } from "@prisma/client";
import Image from "next/image";

interface MenuItemProps {
  menu: Menus;
}

export function MenuItem({ menu }: MenuItemProps) {
  return (
    <div className="flex w-full flex-row  justify-between p-4">
      <div className="flex flex-row gap-4">
        <div className="relative aspect-[2/1] h-full">
          {menu.logoImageUrl && (
            <Image
              src={menu.logoImageUrl}
              fill
              alt="Background image"
              className="rounded-sm object-cover"
            />
          )}
        </div>
        <Link href={`/menu/manage/${menu.slug}/restaurant`} className="min-w-0 flex-1">
          <div className="flex flex-row items-center gap-4">
            <div className="flex flex-col min-w-0">
              <p className="font-semibold break-words">{menu.name}</p>
              <p className="text-sm text-muted-foreground break-words">{menu.address}</p>
            </div>
          </div>
        </Link>
      </div>
      <MenuOperations menuId={menu.id} />
    </div>
  );
}
