import job from "./job";
import profile from "./profile";
import project from "./project";
import post from "./post";
import author from "./author";
import heroe from "./heroe";
import certificate from "./certificate";
import ctfWriteup from "./ctfWriteup";
import { youtube } from "./youtube";
import { table } from "./table";
import blockContent from "./blockContent";
import quiz from "./quiz";

export const schemaTypes = [
  profile,
  job,
  project,
  certificate,
  post,
  ctfWriteup,
  author,
  heroe,

  // Reference types
  blockContent,
  youtube,
  table,
  quiz,
];
