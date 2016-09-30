# collator
A NodeJS command line utility to collate files into user defined folders based on user defined regular expressions.

This utility can be configured to sort whatever files into whichever folders you want.  For instance, a use case that drove its development was when one downloads videos whether it be through torrents, NZBs, or direct download sites, the desired file is usually nested within one or more folders.  With many videos nested in folders, one's Downloads folder can become quite messy.  In addition, if you wish to move only the videos to a separate backup you'd have to drill down into each folder and pull out the videos.  This tedious process can be avoided using this tool.

To accommodate various requirements when collating files, whether it be a form of filename or file extension this utility allows for filtering based on regular expressions.

<a href="https://nodei.co/npm/collator/"><img src="https://nodei.co/npm/collator.png?downloads=true&downloadRank=true&stars=true"></a>

##Getting Started

1. Install the utility
  ```shell
  $ npm install collator -g
  ```
This will install the utility in the global namespace for you to use in any directory.

2. Setup configuration
The utility has a default configuration however you'll probably want to configure your own.  The below will initialize a configuration file in current directory:
  ```shell
  $ collator -i -p .
  ```
Here is an example of a configuration file:
  ```javascript
  {
    "ROOT_SEARCH_DIR":".",
    "DESTINATION_DIRS": {
      "dest": "./completed",
      "trash": "./trash"
    },
    "PATH_EXCLUSIONS": [
      "./incomplete",
      "./NZBs"
    ],
    "FILTERS": {
      "dest": "^(?!.*sample)(.*\\.((mkv|avi|mp4|mpeg|mpg|mov)$))[^.]*$",
      "trash": "*"
    },
    "VIDEORENAME": true
  }
  ```

3. Run the utility
  ```shell
  $ collator
  ```
This will run the utility and begin recursively filtering files starting at the `ROOT_SEARCH_DIR`.

##Options
| Name | Description |
| ---- | ----------- |
| -i, --initconfig | Initialize a custom configuration file |
| -p, --filepath [value] | Optional filepath modifier to specify where the newly created custom configuration file will be placed |
| -c, --collatepath [value] | Optional override that will specify the path to begin recursive collation.  Overrides `ROOT_SEARCH_DIR`. |
| -h, --help | Output usage information |
| -V, --version | Output the version number |

##Configuration Parameters
| Name | Example | Description |
| ---- | ------- | ----------- |
| ROOT_SEARCH_DIR | `./root` | A root filepath where recursive collation will begin. |
| DESTINATION_DIRS | `{"dest": "./completed"}` | Key-value pairs specifying a particular destination filepath for a collated file.  Keys must map to a corresponding regular expression mapped in `FILTERS`. |
| FILTERS | <code>{"dest": "^(?!.*sample)(.\*\\\.((mkv&#124;avi&#124;mp4&#124;mpeg&#124;mpg&#124;mov)&#x24;))[^.]*&#x24;"}</code> | Key-value pairs specifying regular expressions to match files.  Note that a `*` value is used to denote a key that will correspond to a key-value pair in `DESTINATION_DIRS` used to throw files that do not match to any other defined regular expression. |
| PATH_EXCLUSIONS | `["./incomplete",]` | An array of directory filepaths to ignore while recursively collating |
| VIDEORENAME | `true` | A boolean flag to enable the renaming of files that match a regular expression but have no TV season episode format ie. s01e02 and does not contain the first 5 characters of its parent folder name.  This is for a specific usecase and will be later genericized.  |
