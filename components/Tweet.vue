<template>
  <li class="h-24 w-screen border-grey-lighter border-solid border-b">
    <div class="flex my-4">
      <div class="w-1/5 flex flex-col justify-start items-center">
        <img
          class="w-12 h-12 rounded-full"
          src="https://tailwindcss.com/img/jonathan.jpg"
        />
      </div>
      <div class="mx-2 h-full w-4/5 text-xs">
        <ul class="list-reset flex">
          <li class="font-bold">名前</li>
          <li class="ml-2 text-grey-darker">アカウント名</li>
          <li class="ml-2 text-grey-darker">投稿時間</li>
        </ul>
        <div class="my-2">
          ツイーーーーーーーーーーートツイーーーーーーーーーーートツイーーーーツイーーーーーーーートツイーーーー
        </div>
        <ul class="list-reset flex justify-between">
          <li>
            <font-awesome-icon
              class="text-grey-dark"
              icon="comment"
              size="sm"
            />
          </li>
          <li>
            <font-awesome-icon
              class="text-grey-dark"
              icon="retweet"
              size="sm"
            />
          </li>
          <li>
            <font-awesome-icon class="text-grey-dark" icon="heart" size="sm" />
          </li>
          <li>
            <font-awesome-icon
              class="text-grey-dark"
              icon="share-alt"
              size="sm"
            />
          </li>
        </ul>
      </div>
    </div>
  </li>
</template>
