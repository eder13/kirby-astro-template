<?php

return [
    'debug' => true,
    'panel' => [
        'js' => 'assets/js/custom/panel.js',
        'css' => 'assets/css/custom/_root.css',
    ],
    'content' => [
        'uuid' => false
    ],
    'routes' => [
        [
          'pattern' => 'ssg/deploy',
          'action'  => function () {
                $payload = get();
                $secret = $payload['secret'];

                if (($user = kirby()->user()) && $user->isLoggedIn()) {
                    $env = parse_ini_file(__DIR__ . '/../../../.env');
                    $domain = $env["DOMAIN"];
                    $deployment_key = $env["DEPLOYMENT_KEY"];
                    
                    if ($deployment_key != $secret || !($_SERVER['HTTP_HOST'] == "localhost" || strpos($_SERVER['HTTP_HOST'], $domain) != false)) {
                        $errorMsg = "Error: Invalid Secret or Domain.";
                        
                        return [
                            'status' => 200,
                            'message' => $errorMsg,
                            'retval' => 1,
                        ];
                    }

                    $BUILD_ASTRO_COMMAND = "echo '----- Step 1: Generating build files -----' && echo '' && export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin && export ASTRO_TELEMETRY_DISABLED=1 && cd ../frontend && " . "DOMAIN=" . $_SERVER['HTTP_HOST'] . " npm run build && echo '' && echo 'done!' 2>&1";
                    $output = null;
                    $retval = null;
                    exec($BUILD_ASTRO_COMMAND, $output, $retval);

                    if ($retval != 0 || $retval != "0") {     
                        $ASTRO_BUILD_FAILED = "echo '----- Step 1: Generating Astro build with NodeJS failed.-----' && echo ''";
                        
                        return [
                            'status' => 200,
                            'message' => $output,
                            'retval' => $retval,
                        ];
                    }

                    $output_failed = null;
                    $retval_failed = null;

                    $BACKUP_CURRENT_INDEX = "echo '' && echo '----- Step 2: Backing up current build files -----' && cd .. && test -d tmp && rm -R tmp || echo 'Creating tmp folder' && mkdir tmp && find . -type f -regextype posix-extended ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*)' -exec sh -c 'mkdir -p tmp/$(dirname \"{}\") && cp \"{}\" tmp/$(dirname \"{}\")/' \; && echo 'done!' && echo '' 2>&1";
                    if (stripos(PHP_OS, 'LIN') !== 0) {
                        $BACKUP_CURRENT_INDEX = "echo '' && echo '----- Step 2: Backing up current build files -----' && cd .. && test -d tmp && rm -R tmp || echo 'Creating tmp folder' && mkdir tmp && find -E . -type f ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*)' -exec sh -c 'mkdir -p tmp/$(dirname \"{}\") && cp \"{}\" tmp/$(dirname \"{}\")/' \; && echo 'done!' && echo '' 2>&1";
                    }
                    $output2 = null;
                    $retval2 = null;
                    exec($BACKUP_CURRENT_INDEX, $output2, $retval2);

                    if ($retval2 != 0 || $retval2 != "0") {
                        $CLEANUP_BACKUP = "echo '----- Step 2 backup ***FAILED***: Cleaning up -----' && cd .. && echo '' && test -d tmp && rm -R tmp || echo 'Folder tmp does not exist. Nothing to remove.' 2>&1";
                        exec($CLEANUP_BACKUP, $output_failed, $retval_failed);

                        return [
                            'status' => 200,
                            'message' => array_merge($output, $output2, $output_failed),
                            'retval' => $retval2,
                        ];
                    }

                    $DELETE_CURRENT_INDEX = "echo '----- Step 3: Deleting old build files which are currently deployed -----' && cd .. && find . -mindepth 1 -regextype posix-extended ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*|^\.\/README.*|^\.\/docs.*)' -exec rm -rf {} + && echo 'done!' && echo '' 2>&1";
                    if (stripos(PHP_OS, 'LIN') !== 0) {
                        $DELETE_CURRENT_INDEX = "echo '----- Step 3: Deleting old build files which are currently deployed -----' && cd .. && find -E . -mindepth 1 ! -regex '(^\.\/\..*|^\.\/frontend.*|^\.\/cms.*|^\.\/tmp.*|^\.\/README.*|^\.\/docs.*)' -exec rm -rf {} + && echo 'done!' && echo '' 2>&1";
                    }
                    $output3 = null; 
                    $retval3 = null;
                    exec($DELETE_CURRENT_INDEX, $output3, $retval3);

                    if ($retval3 != 0 || $retval3 != "0") {
                        $CLEANUP_DELETE = "echo '----- Step 3 deleting old build files ***FAILED***: Reverting to old build -----' && cd .. && mv tmp/* . && rm -R tmp";
                        exec($CLEANUP_DELETE, $output_failed, $retval_failed);

                        return [
                            'status' => 200,
                            'message' => array_merge($output, $output2, $output3, $output_failed),
                            'retval' => $retval3,
                        ];
                    }

                    $MOVE_CURRENT_INDEX = "echo '----- Step 4: Moving new build files into current root directory -----' && cd .. && mv frontend/dist/* . && rm -R tmp && echo 'Successfully replaced build files in root!' && echo '' && echo 'Deployment Succeeded! ☺︎' 2>&1";
                    $output4 = null; 
                    $retval4 = null;
                    exec($MOVE_CURRENT_INDEX, $output4, $retval4);

                    if ($retval4 != 0 || $retval4 != "0") {
                        $CLEANUP_MOVE = "echo '----- Step 4 moving new build files ***FAILED***: Reverting to old build -----' && cd .. && mv tmp/* . && rm -R tmp";
                        exec($CLEANUP_MOVE, $output_failed, $retval_failed);

                        return [
                            'status' => 200,
                            'message' => array_merge($output, $output2, $output3, $output4, $output_failed),
                            'retval' => $retval4,
                        ];
                    }

                    return [
                        'status' => 200,
                        'message' => array_merge($output, $output2, $output3, $output4),
                        'retval' => $retval4
                    ];
                }

                return [
                    'status' => 401 
                ];
            },
            "method" => "POST"
        ]
    ]
];
