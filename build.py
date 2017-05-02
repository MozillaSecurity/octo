from __future__ import print_function

import argparse
import os
import sys
from shutil import copy

# List of files which must be loaded first
preload = [
    'random/random.js',
    'random/mersennetwister.js',
    'utils/init.js',
    'utils/platform.js',
    'logging/console.js',
    'make/init.js'
]


def argparser():
    parser = argparse.ArgumentParser()
    parser.add_argument('-l', '--libs', required=True, help='Directory containing the octo libraries.')
    parser.add_argument('-d', '--deploy', required=True, help='Directory where the combined octo library will be built.')
    args = parser.parse_args()

    if not os.path.isdir(args.libs):
        parser.error("Lib directory doesn't exist!")
    if not os.path.isdir(args.deploy):
        parser.error("Deploy directory doesn't exist!")

    return args


def main():
    args = argparser()

    data = []
    loaded = []

    for filename in preload:
        path = os.path.join(args.libs, filename)
        if not os.path.isfile(path):
            raise Exception("Unable to find file in preload: {0}".format(path))
        print("Adding path: {0}".format(path))
        with open(path) as f:
            data.append(f.read())
            loaded.append(path)

    for root, dirs, files in os.walk(args.libs):
        for filename in files:
            path = os.path.join(root, filename)
            if path.endswith('.js') and path not in loaded:
                print("Adding path: {0}".format(path))
                with open(path) as f:
                    data.append(f.read())
    
    octo_path = os.path.join(args.deploy, 'octo.js')
    with open(octo_path, 'w') as f:
        f.write('\n\n'.join(data))


if __name__ == "__main__":
    main()
