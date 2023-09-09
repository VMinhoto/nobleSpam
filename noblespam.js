// ==UserScript==
// @name           Devil's Noble Spam Enhancer V2
// @description    Adds a button the 'map' screen that will help you noble spam much easier.
// @author         Devilicious#9733 (discord) (Bit fix to provide ms)
// @version        1.1
// @grant          none
// @include        https://*.tribalwars.com.pt*screen=map*
// @updateURL      https://devilicious.dev/api/tw/scripts/user/devil_noble_spam_planner_enhancer_pt.user.js
// @downloadURL    https://devilicious.dev/api/tw/scripts/user/devil_noble_spam_planner_enhancer_pt.user.js
// ==/UserScript==

if (typeof window.twLib === 'undefined') {
    window.twLib = {
        queues: null,
        init: function () {
            if (this.queues === null) {
                this.queues = this.queueLib.createQueues(5);
            }
        },
        queueLib: {
            maxAttempts: 3,
            Item: function (action, arg, promise = null) {
                this.action = action;
                this.arguments = arg;
                this.promise = promise;
                this.attempts = 0;
            },
            Queue: function () {
                this.list = [];
                this.working = false;
                this.length = 0;

                this.doNext = function () {
                    let item = this.dequeue();
                    let self = this;

                    if (item.action === 'openWindow') {
                        window.open(...item.arguments).addEventListener('DOMContentLoaded', function () {
                            self.start();
                        });
                    } else {
                        $[item.action](...item.arguments).done(function () {
                            item.promise.resolve.apply(null, arguments);
                            self.start();
                        }).fail(function () {
                            item.attempts += 1;
                            if (item.attempts < twLib.queueLib.maxAttempts) {
                                self.enqueue(item, true);
                            } else {
                                item.promise.reject.apply(null, arguments);
                            }

                            self.start();
                        });
                    }
                };

                this.start = function () {
                    if (this.length) {
                        this.working = true;
                        this.doNext();
                    } else {
                        this.working = false;
                    }
                };

                this.dequeue = function () {
                    this.length -= 1;
                    return this.list.shift();
                };

                this.enqueue = function (item, front = false) {
                    (front) ? this.list.unshift(item) : this.list.push(item);
                    this.length += 1;

                    if (!this.working) {
                        this.start();
                    }
                };
            },
            createQueues: function (amount) {
                let arr = [];

                for (let i = 0; i < amount; i++) {
                    arr[i] = new twLib.queueLib.Queue();
                }

                return arr;
            },
            addItem: function (item) {
                let leastBusyQueue = twLib.queues.map(q => q.length).reduce((next, curr) => (curr < next) ? curr : next, 0);
                twLib.queues[leastBusyQueue].enqueue(item);
            },
            orchestrator: function (type, arg) {
                let promise = $.Deferred();
                let item = new twLib.queueLib.Item(type, arg, promise);

                twLib.queueLib.addItem(item);

                return promise;
            }
        },
        ajax: function () {
            return twLib.queueLib.orchestrator('ajax', arguments);
        },
        get: function () {
            return twLib.queueLib.orchestrator('get', arguments);
        },
        post: function () {
            return twLib.queueLib.orchestrator('post', arguments);
        },
        openWindow: function () {
            let item = new twLib.queueLib.Item('openWindow', arguments);

            twLib.queueLib.addItem(item);
        }
    };

    twLib.init();
}

// code from https://github.com/pieroxy/lz-string
window.LZString = function() {
    var r = String.fromCharCode;

    var i = {
        compressToUTF16: function(o) {
            return null == o ? '' : i._compress(o, 15, function(o) {
                return r(o + 32);
            }) + ' ';
        }, decompressFromUTF16: function(r) {
            return null == r ? '' : '' == r ? null : i._decompress(r.length, 16384, function(o) {
                return r.charCodeAt(o) - 32;
            });
        }, compress: function(o) {
            return i._compress(o, 16, function(o) {
                return r(o);
            });
        }, _compress: function(r, o, n) {
            if (null == r) return '';
            var e, t, i, s = {}, u = {}, a = '', p = '', c = '', l = 2, f = 3, h = 2, d = [], m = 0, v = 0;
            for (i = 0; i < r.length; i += 1) if (a = r.charAt(i), Object.prototype.hasOwnProperty.call(s, a) || (s[a] = f++, u[a] = !0), p = c + a, Object.prototype.hasOwnProperty.call(s, p)) c = p; else {
                if (Object.prototype.hasOwnProperty.call(u, c)) {
                    if (c.charCodeAt(0) < 256) {
                        for (e = 0; e < h; e++) m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                        for (t = c.charCodeAt(0), e = 0; e < 8; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    } else {
                        for (t = 1, e = 0; e < h; e++) m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                        for (t = c.charCodeAt(0), e = 0; e < 16; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    }
                    0 == --l && (l = Math.pow(2, h), h++), delete u[c];
                } else for (t = s[c], e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                0 == --l && (l = Math.pow(2, h), h++), s[p] = f++, c = String(a);
            }
            if ('' !== c) {
                if (Object.prototype.hasOwnProperty.call(u, c)) {
                    if (c.charCodeAt(0) < 256) {
                        for (e = 0; e < h; e++) m <<= 1, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
                        for (t = c.charCodeAt(0), e = 0; e < 8; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    } else {
                        for (t = 1, e = 0; e < h; e++) m = m << 1 | t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
                        for (t = c.charCodeAt(0), e = 0; e < 16; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                    }
                    0 == --l && (l = Math.pow(2, h), h++), delete u[c];
                } else for (t = s[c], e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
                0 == --l && (l = Math.pow(2, h), h++);
            }
            for (t = 2, e = 0; e < h; e++) m = m << 1 | 1 & t, v == o - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            for (; ;) {
                if (m <<= 1, v == o - 1) {
                    d.push(n(m));
                    break;
                }
                v++;
            }
            return d.join('');
        }, _decompress: function(o, n, e) {
            var t, i, s, u, a, p, c, l = [], f = 4, h = 4, d = 3, m = '', v = [],
              g = { val: e(0), position: n, index: 1 };
            for (t = 0; t < 3; t += 1) l[t] = t;
            for (s = 0, a = Math.pow(2, 2), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
            switch (s) {
                case 0:
                    for (s = 0, a = Math.pow(2, 8), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                    c = r(s);
                    break;
                case 1:
                    for (s = 0, a = Math.pow(2, 16), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                    c = r(s);
                    break;
                case 2:
                    return '';
            }
            for (l[3] = c, i = c, v.push(c); ;) {
                if (g.index > o) return '';
                for (s = 0, a = Math.pow(2, d), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                switch (c = s) {
                    case 0:
                        for (s = 0, a = Math.pow(2, 8), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                        l[h++] = r(s), c = h - 1, f--;
                        break;
                    case 1:
                        for (s = 0, a = Math.pow(2, 16), p = 1; p != a;) u = g.val & g.position, g.position >>= 1, 0 == g.position && (g.position = n, g.val = e(g.index++)), s |= (u > 0 ? 1 : 0) * p, p <<= 1;
                        l[h++] = r(s), c = h - 1, f--;
                        break;
                    case 2:
                        return v.join('');
                }
                if (0 == f && (f = Math.pow(2, d), d++), l[c]) m = l[c]; else {
                    if (c !== h) return null;
                    m = i + i.charAt(0);
                }
                v.push(m), l[h++] = i + m.charAt(0), i = m, 0 == --f && (f = Math.pow(2, d), d++);
            }
        }
    };
    return i;
}();

// Keuring tickets: t14630606/t14675460
const version = 'v1.1'
const author = 'Devilicious#9733 (ixfuryanix)';
const coordinateRegex = /\d{1,3}\|\d{1,3}/g;
const isOnCombinedOverview = game_data.screen === 'overview_villages' && $('#combined_table').length;
let storedVillageList = {};
let nobles = [];

const loadAlreadyRunningCommands = (targetId) => twLib.get({url: game_data.link_base_pure + 'info_village&id=' + targetId});
const convertToDate = (twDate) => {
    const t = twDate.match(/\d+:\d+:\d+.\d+/) ?? twDate.match(/\d+:\d+:\d+/);
    const serverDate = $('#serverDate').text().replace(/\//g, '-').replace(/(\d{1,2})-(\d{1,2})-(\d{4})/g, '$3-$2-$1');
    let date = new Date(serverDate + ' ' + t);

    if (twDate.match(window.lang['57d28d1b211fddbb7a499ead5bf23079'].split(' ')[0])) {
        date.setDate(date.getDate() + 1);
        return date;
    } else if (twDate.match(/\d+\.\d+/)) {
        let monthDate = twDate.match(/\d+\.\d+/)[0].split('.');
        return new Date(date.getFullYear() + '-' + monthDate[1] + '-' + monthDate[0] + ' ' + t);
    } else {
        return date;
    }
}
const loadVillageData = () => {
    const settings = JSON.parse(localStorage.getItem(`village_list_settings_${game_data.world}`)) ?? { lastCheckedAt : null, villages: {}};
    if (!settings.lastCheckedAt || Math.abs(new Date().getTime() - new Date(settings.lastCheckedAt).getTime()) / 36e5 > 1) {
        console.log(settings.lastCheckedAt, 'over 1 hour has past since last check. Refreshing village list.txt');
        twLib.get({
            url: location.origin + '/map/village.txt',
            success: function (villages) {
                storedVillageList = villages.match(/[^\r\n]+/g).map(villageData => {
                    const [id, name, x, y, player_id] = villageData.split(',');
                    const coordinates = `${x}|${y}`;
                    return { id: id, name: name, player_id: player_id, coordinates: coordinates };
                });
                const settingsToSave = {
                    lastCheckedAt: new Date(),
                    villages: LZString.compressToUTF16(JSON.stringify(storedVillageList))
                }
                localStorage.setItem(`village_list_settings_${game_data.world}`, JSON.stringify(settingsToSave));
                $("#commandCenter_villages").text(Object.keys(storedVillageList).length);
                UI.SuccessMessage('Successfully stored ' + Object.keys(storedVillageList).length + ' villages for TW world: ' + game_data.world + ' to localstorage.');
            }
        });
    } else {
        storedVillageList = JSON.parse(LZString.decompressFromUTF16(settings.villages));
    }
}
const getNoblesFor = (html) => {
    const dorpIndex = $(html).find(`#combined_table th:contains("${window.lang['abc63490c815af81276f930216c8d92b']}")`).index();
    const nobleIndex = $(html).find('#combined_table').find(`img[src*="snob"]`).closest('th').index();
    return $(html).find('#combined_table tr.nowrap').map((_, r) => {
        return `${$(r).find(`td:eq(${dorpIndex})`).text().match(coordinateRegex).pop()},${$(r).find(`td:eq(${nobleIndex})`).text()}`;
    }).filter((_, r) => r.split(',')[1] > 0).get();
}

$('#content_value h2:first').after(`<button id="devilNobleSpamEnhancerBtn" class="btn btn-default">Open Devil Noble Spam Enhancer</button>`);
$('#devilNobleSpamEnhancerBtn').click(() => {
    loadVillageData();
    initializeScript();
})

async function initializeScript() {
    nobles = isOnCombinedOverview ? getNoblesFor(document) : await getNoblesFromOverview();

    Dialog.show('commands', `
    <div style="width: 600px">
        <h1 style="padding: 5px;">Noble Spam Planner Enhancer <small style="font-weight: bold; font-size: 10px; color: darkblue">${version} - ${author}</small></h1>
        <small>Stored <b id="commandCenter_villages">${Object.keys(storedVillageList).length}</b> villages in localstorage. <a onclick="resetLocalStorage()" style="cursor: pointer;">Reset storage</a></small>
        <div style="${nobles.length > 0 ? 'margin-top:5px; margin-bottom:5px' : 'display:none'}">
            <b>${nobles.reduce((a, line) => a + parseInt(line.split(',')[1]), 0)} Nobles in ${nobles.length} villages:</b><br>
            <textarea onclick="this.select();" id="nobles" style=" width: 97%;" rows="5">${nobles.join('\n')}</textarea>
            <br>
        </div>
        <div style="margin-top: 5px">
            <b>Coordinates:</b><br>
            <textarea id="targetsToLookup" style=" width: 97%;" rows="5"></textarea>
            <br>
            <input id="fetchCommands" type="button" class="btn btn-default" disabled value="Fetch Commands">
        </div>
    </div>`);

    $('#targetsToLookup').on('input', function () {
        $('#fetchCommands').prop('disabled', $('#targetsToLookup').val().match(coordinateRegex) === null);
    });
    $('#fetchCommands').click(() => fetchCommands());
}

async function loadOverview(mode) {
    let villages = [];
    const getOverviewInfo = (mode, page) => new Promise((resolve, reject) => {
        resolve(twLib.get(`${game_data.link_base_pure}overview_villages&mode=${mode}&group=0&page=${page}&`));
    });

    await getOverviewInfo(mode, -1).then(async (html) => {
        $.merge(villages, $(html));
        const pages = $('.paged-nav-item', html).parent().find('option').length ? $('.paged-nav-item', html).parent().find('option').length - 1 : $('.paged-nav-item', html).length;
        const villagesPerPage = $('#mobileHeader').length ? 10 : Number($('[name=page_size]', html).val());
        const startingPage = Math.floor(1000 / villagesPerPage);

        for (let x = startingPage; x < pages; x++) {
            await getOverviewInfo(mode, x).then((html) => {
                $.merge(villages, $(html));
            });
        }
    });
    return villages;
}

async function getNoblesFromOverview() {
    return new Promise((resolve, reject) => {
        loadOverview('combined').then(html => resolve(getNoblesFor(html)));
    });
}

function resetLocalStorage() {
    localStorage.removeItem(`devil_spam_planner_settings_${game_data.world}`);

    loadVillageData();
}

function fetchCommands() {
    const targetsToLookup = [...new Set($('#targetsToLookup').val().match(coordinateRegex))] || [];
    Dialog.close();
    $('#contentContainer').before(`
    <div class="content-border" style="margin-bottom: 10px;">
    <h1 style="padding: 10px 0 0 10px;">Noble Spam Planner Enhancer <small style="font-weight: bold; font-size: 10px; color: darkblue">${version} - ${author}</small></h1>
        <div style="${nobles.length > 0 ? 'width: 100%;padding: 10px 0 0 10px;}' : 'display:none'}">
            <b>${nobles.reduce((a, line) => a + parseInt(line.split(',')[1]), 0)} Nobles in ${nobles.length} villages:</b><br>
            <textarea onclick="this.select();" id="nobles" style=" width: 97%;" rows="5">${nobles.join('\n')}</textarea>
            <br>
        </div>
        <table class="vis" id="commandCenter_overview" style="box-shadow: darkgray 2px 2px 2px;border: 2px solid rgb(193, 162, 100);width: 98%;border-spacing: 2px;border-collapse: separate; margin: 10px;">
            <tbody>
                <tr>
                    <th style="text-align: center;">Target</th>
                    <th style="text-align: center;">Commands</th>
                </tr><tr>
                    <th style="text-align: center;" colspan="2">
                        <span style="float: right">
                            Add&nbsp;
                            <input id="nobleAmount" type="number" style="width: 25px" value="1" min="1">
                            noble(s) to the last&nbsp;
                            <input id="commandAmount" type="number" style="width: 25px" value="5" min="1">
                            attacks of the type&nbsp;
                            <select id="attackType">
                                <option style="background-color: white" value="all">All</option>
                                <option style="background-color: green" value="small">Green</option>
                                <option style="background-color: orangered" value="medium">Orange</option>
                                <option style="background-color: red;" value="large">Red</option>
                            </select>
                            which have arrival date&nbsp;
                            <input id="commandDate" type="date" data-title="Optional">
                            <input id="inputNobles" style="cursor: pointer" type="button" value="Add nobles">
                        </span>
                    </th>
                </tr>
            </tbody>
        </table>
        <button id="commandCenter_extract" style="margin-left: 10px;" class="btn btn-research">Extract Planning Input</button>
        <textarea id="commandCenter_planningInput" style="width: 97%; margin: 10px;" rows="10"></textarea>
    </div>
    `);
    UI.ToolTip('#commandDate');
    targetsToLookup.forEach((t) => {
        const targetId = storedVillageList.find((village) => village.coordinates === t).id;
        $.when(loadAlreadyRunningCommands(targetId).done(function (html) {
            const commandsTable = $(html).find('.commands-container');
            commandsTable.find('tr th:first').attr('width', '50%').next().attr('width', '25%');
            commandsTable.find('tr:first th:last').after('<th>Nobles</th>')
            commandsTable.find('tr.command-row')
              .each((_, row) => $(row).append(`<td><input class="nobleAmount" style="width: 50%; margin-right: 5px;" type="number" value="0" min="0"><img src="/graphic/unit/unit_snob.png" alt="snob" style="vertical-align: bottom;margin-top: 2px;width: 18px;height: 18px;"></td>`))
              .filter((_, el) => $(el).find('img[src*="/return_"], img[src*="/back.png"], img[src*="/farm.png"], img[src*="/support.png"]', el).length > 0)
              .remove();

            const htmlToInsert = commandsTable.find('tr.command-row').length === 0 ? 'No commands found.' : commandsTable.html();
            $('#commandCenter_overview tbody:first').append(`<tr><td><a style="margin-left: 5px" target="_blank" href="${game_data.link_base_pure}info_village&id=${targetId}">${t}</a></td><td>${htmlToInsert}</td></tr>`);
            Timing.tickHandlers.timers.init();
            $('.command-row').off().on('click', (event) => $(event.currentTarget).find(':input').get(0).value++);
            $('.command-row input').off().on('click', (event) => $(event.stopPropagation()) && event.target.select());
        }));
    });
    $('#attackType').on('change', () => {
        const color = $('#attackType option:selected').css('background-color');
        $('#attackType').css('background-color', color);
    });
    $('#inputNobles').on('click', () => {
        $('.nobleAmount').val(0);
        const nobleAmount = $('#nobleAmount').val();
        const commandAmount = $('#commandAmount').val();
        const commandDate = $('#commandDate').val();
        const attackType = $('#attackType option:selected').val();

        $('#commandCenter_overview .vis').get().forEach(table => {
            const filteredRows = $('tr.command-row', table).get().filter(tableRow => {
                let correctCommandDate = true, correctType = true;
                if (commandDate) {
                    const rowDate = convertToDate($('td:eq(1)', tableRow).text().trim()).toISOString().split('T')[0];
                    console.log(row)
                    correctCommandDate = rowDate === commandDate;
                }
                if (attackType !== 'all') {
                    const rowType = $(`.command_hover_details:first img[src*=${attackType}]`, tableRow);
                    correctType = rowType.length > 0;
                }

                return correctCommandDate && correctType;
            });
            const spliceStart = filteredRows.length - commandAmount > 0 ? filteredRows.length - commandAmount : 0;
            const rowsToUse = filteredRows.splice(spliceStart, filteredRows.length);

            rowsToUse.forEach(input => {
                $('input', input).val(nobleAmount)
            });
        });
    });
    $('#commandCenter_extract').click(() => {
        const rows = $('#commandCenter_overview .command-row input').filter((_, i) => $(i).val() > 0).map((_, i) => $(i).closest('tr')).get() || [];
        const planningInput = rows.map((r) => {
            const coord = $(r).closest('table').closest('tr').find('td:eq(0)').text();
            let date = convertToDate($(r).find('td:eq(1)').text());
            date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
            const formattedDate = date.toISOString().slice(0, -1);
            const value = $(r).find(':input').val();
            return `${coord},${value},${formattedDate}`
        });
        $('#commandCenter_planningInput').val(planningInput.join('\n'));
    });
}
